import Medusa from '@medusajs/js-sdk';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';

export type AuthStateType =
  | {
      status: 'loading';
    }
  | {
      status: 'unauthenticated';
      medusaUrl?: string;
      userEmail?: string;
    }
  | {
      status: 'authenticated';
      user: {
        id: string;
        name: string;
        email: string;
      };
      medusaUrl: string;
      userEmail: string;
      apiKey: string;
    };

export type AuthContextType = {
  state: AuthStateType;
  login: (medusaUrl: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextType>({
  state: { status: 'loading' },
  login: async () => {
    throw new Error('login function not implemented');
  },
  logout: async () => {
    throw new Error('logout function not implemented');
  },
});

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [state, setState] = React.useState<AuthStateType>({
    status: 'loading',
  });

  const login = React.useCallback(
    async (medusaUrl: string, email: string, password: string) => {
      if (state.status === 'authenticated') {
        throw new Error('User is already authenticated');
      }

      const sdk = new Medusa({
        baseUrl: medusaUrl,
        debug: true,
        auth: {
          type: 'jwt',
          jwtTokenStorageMethod: 'nostore',
        },
      });

      const loginResponse = await sdk.auth.login('user', 'emailpass', {
        email,
        password,
      });

      if (typeof loginResponse !== 'string') {
        throw new Error('Handle this redirect later');
      }

      const userResponse = await sdk.admin.user.me(undefined, {
        Authorization: `Bearer ${loginResponse}`,
      });
      // TODO: handle create api key error if user already has one
      // const apiKeyResponse = await sdk.admin.apiKey.create(
      //   {
      //     type: 'secret',
      //     title: `Agilo POS for ${userResponse.user.email}`,
      //   },
      //   undefined,
      //   {
      //     Authorization: `Bearer ${loginResponse}`,
      //   },
      // );
      // const apiKey = apiKeyResponse.api_key.token;
      const apiKey = loginResponse; // For now, use the JWT token as the API key

      await SecureStore.setItemAsync('medusaUrl', medusaUrl);
      await SecureStore.setItemAsync('userEmail', email);
      await SecureStore.setItemAsync('apiKey', apiKey);

      setState({
        status: 'authenticated',
        user: {
          id: userResponse.user.id,
          name:
            [userResponse.user.first_name, userResponse.user.last_name].filter(Boolean).join(' ') ||
            userResponse.user.email.split('@')[0],
          email: userResponse.user.email,
        },
        userEmail: email,
        medusaUrl,
        apiKey,
      });
    },
    [state.status],
  );

  const logout = React.useCallback(async () => {
    if (state.status !== 'authenticated') {
      throw new Error('User is not authenticated');
    }

    // TODO: Revoke and delete the API key, have to store its ID first

    await SecureStore.deleteItemAsync('apiKey');
    setState({ status: 'unauthenticated' });
  }, [state.status]);

  React.useEffect(() => {
    let cancelled = false;

    const loadAuthState = async () => {
      try {
        const medusaUrl = await SecureStore.getItemAsync('medusaUrl');
        const userEmail = await SecureStore.getItemAsync('userEmail');
        const apiKey = await SecureStore.getItemAsync('apiKey');

        if (cancelled) {
          return;
        }

        if (medusaUrl && apiKey) {
          const sdk = new Medusa({
            baseUrl: medusaUrl,
            debug: true,
            auth: {
              type: 'jwt',
              jwtTokenStorageMethod: 'custom',
              storage: {
                getItem: () => apiKey,
                setItem: () => {},
                removeItem: () => {},
              },
            },
          });

          if (cancelled) {
            return;
          }

          const userResponse = await sdk.admin.user.me();

          if (cancelled) {
            return;
          }

          setState({
            status: 'authenticated',
            user: {
              id: userResponse.user.id,
              name:
                [userResponse.user.first_name, userResponse.user.last_name].filter(Boolean).join(' ') ||
                userResponse.user.email.split('@')[0],
              email: userResponse.user.email,
            },
            userEmail: userResponse.user.email,
            medusaUrl,
            apiKey,
          });
        } else {
          if (cancelled) {
            return;
          }

          await SecureStore.deleteItemAsync('apiKey');

          setState({
            status: 'unauthenticated',
            medusaUrl: medusaUrl ?? undefined,
            userEmail: userEmail ?? undefined,
          });
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        await SecureStore.deleteItemAsync('apiKey');

        console.error('Failed to load auth state:', error);
        setState({ status: 'unauthenticated', medusaUrl: undefined });
      }
    };

    loadAuthState();

    return () => {
      cancelled = true;
    };
  }, []);

  return <AuthContext.Provider value={{ state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthCtx = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthCtx must be used within an AuthProvider');
  }
  return context;
};

export const useAuthenticated = () => {
  const { state } = useAuthCtx();

  if (state.status !== 'authenticated') {
    throw new Error('User is not authenticated');
  }

  return state;
};

export const useMedusaSdk = () => {
  const { state } = useAuthCtx();

  if (state.status !== 'authenticated') {
    throw new Error('User is not authenticated');
  }

  return React.useMemo(
    () =>
      new Medusa({
        baseUrl: state.medusaUrl,
        debug: true,
        auth: {
          type: 'jwt',
          jwtTokenStorageMethod: 'custom',
          storage: {
            getItem: () => state.apiKey,
            setItem: () => {},
            removeItem: () => {},
          },
        },
      }),
    [state.medusaUrl, state.apiKey],
  );
};
