import { useCreateSalesChannel } from '@/api/hooks/sales-channel';
import { AdminSalesChannel } from '@medusajs/types';
import React from 'react';
import { Alert } from 'react-native';
import * as z from 'zod/v4';
import Form from './form/Form';
import FormButton from './form/FormButton';
import TextField from './form/TextField';

interface SalesChannelCreateFormProps {
  onSalesChannelCreated: (salesChannel: AdminSalesChannel) => void;
  defaultValues?: Partial<SalesChannelFormData>;
}

const salesChannelSchema = z.object({
  name: z.string().min(1, 'Sales channel name is required'),
  description: z.string().optional(),
});

type SalesChannelFormData = z.infer<typeof salesChannelSchema>;

const SalesChannelCreateForm: React.FC<SalesChannelCreateFormProps> = ({
  onSalesChannelCreated,
  defaultValues = { name: 'POS', description: 'Created by Agilo POS' },
}) => {
  const createSalesChannel = useCreateSalesChannel();

  const handleCreateSalesChannel = async (data: SalesChannelFormData) => {
    try {
      const result = await createSalesChannel.mutateAsync({
        name: data.name,
        description: data.description || 'Created by Agilo POS',
      });
      onSalesChannelCreated(result.sales_channel);
      return result.sales_channel;
    } catch (error) {
      Alert.alert('Error', 'Failed to create sales channel');
      throw error;
    }
  };

  return (
    <Form
      schema={salesChannelSchema}
      onSubmit={handleCreateSalesChannel}
      defaultValues={defaultValues}
    >
      <TextField name="name" placeholder="Sales Channel Name" />

      <TextField
        name="description"
        placeholder="Description (optional)"
        multiline
        numberOfLines={3}
      />

      <FormButton
        loading={createSalesChannel.isPending}
        disabled={createSalesChannel.isPending}
      >
        Create Channel
      </FormButton>
    </Form>
  );
};

export { SalesChannelCreateForm };
