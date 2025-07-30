import { useAddToDraftOrder } from '@/api/hooks/draft-orders';
import { useProduct } from '@/api/hooks/products';
import { ProductDetailsSkeleton } from '@/components/skeletons/ProductDetailsSkeleton';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { QuantityPicker } from '@/components/ui/QuantityPicker';
import { Text } from '@/components/ui/Text';
import { useSettings } from '@/contexts/settings';
import { AdminProductImage } from '@medusajs/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { CarouselRenderItem, ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';

const windowWidth = Dimensions.get('window').width;

const ProductImagesCarousel: React.FC<{ images: AdminProductImage[] }> = ({ images }) => {
  const targetRef = React.useRef<View>(null);
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const scrollOffsetValue = useSharedValue<number>(0);
  const [width, setWidth] = useState<number>(windowWidth);

  // Calculate height based on width with 4:3 aspect ratio
  const height = Math.round(width * 0.75);

  useLayoutEffect(() => {
    targetRef.current?.measure((x, y, width) => {
      setWidth(width);
    });
  }, []);

  const renderItem = React.useCallback<CarouselRenderItem<AdminProductImage>>(({ item }) => {
    return <Image source={{ uri: item.url }} className="w-full h-full object-cover" />;
  }, []);

  const onPressPagination = React.useCallback(
    (index: number) => {
      carouselRef.current?.scrollTo({
        count: index - progress.value,
        animated: true,
      });
    },
    [progress],
  );

  return (
    <View ref={targetRef}>
      <Carousel
        ref={carouselRef}
        loop={true}
        width={width}
        height={height}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={2000}
        data={images}
        defaultScrollOffsetValue={scrollOffsetValue}
        style={{ width: '100%' }}
        onConfigurePanGesture={(gestureChain) => {
          gestureChain.activeOffsetY([-5, 5]);
        }}
        renderItem={renderItem}
        onProgressChange={progress}
      />

      <Pagination.Basic
        progress={progress}
        data={images.map((item) => item.url)}
        dotStyle={{
          width: (width - 32) / images.length,
          height: 1.5,
          backgroundColor: '#B5B5B5',
        }}
        activeDotStyle={{
          overflow: 'hidden',
          backgroundColor: '#1B1B1B',
        }}
        containerStyle={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
        }}
        horizontal
        onPress={onPressPagination}
      />
    </View>
  );
};

export default function ProductDetailsScreen() {
  const settings = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [visible, setVisible] = React.useState(false);

  const params = useLocalSearchParams<{
    productId: string;
    productName: string;
  }>();
  const { productId, productName /* barcode, scannedProduct, manualEntry */ } = params;
  const productQuery = useProduct(productId);
  const addToDraftOrder = useAddToDraftOrder({
    onSuccess: (data) => {
      router.dismissTo('/(tabs)/cart');
    },
    onError: (error) => {
      console.error('Error adding items to draft order:', error);
    },
  });

  useEffect(() => {
    if (productQuery.data) {
      const firstVariant = productQuery.data.product.variants?.[0];

      if (firstVariant) {
        const initialOptions =
          firstVariant.options?.reduce(
            (acc, option) => {
              if (option.value && option.option_id) {
                acc[option.option_id] = option.value;
              }
              return acc;
            },
            {} as Record<string, string>,
          ) ?? {};

        setSelectedOptions(initialOptions);
      }
    }
  }, [productQuery.data]);

  useEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    }, 100);
  }, []);

  if (productQuery.isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (productQuery.isError) {
    return (
      <BottomSheet visible={true} onClose={() => router.back()} showCloseButton={false} dismissOnOverlayPress>
        <Text className="text-center">Error loading product details</Text>
      </BottomSheet>
    );
  }

  if (!productQuery.data) {
    return (
      <BottomSheet visible={true} onClose={() => router.back()} showCloseButton={false} dismissOnOverlayPress>
        <Text className="text-center">Product not found</Text>
      </BottomSheet>
    );
  }

  const selectedVariant = productQuery.data.product.variants?.find((variant) => {
    return Object.entries(selectedOptions).every(([optionId, value]) =>
      variant.options?.some((option) => option.option_id === optionId && option.value === value),
    );
  });

  const currencyCode = settings.data?.region?.currency_code || 'eur';
  const price = selectedVariant?.prices?.find((price) => price.currency_code === currencyCode);

  return (
    <BottomSheet visible={visible} onClose={() => router.back()} showCloseButton={false} dismissOnOverlayPress>
      {({ animateOut }) => (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-6 bg-gray-100 rounded-xl overflow-hidden">
            {productQuery.data.product.images && productQuery.data.product.images.length ? (
              <ProductImagesCarousel images={productQuery.data.product.images} />
            ) : (
              <View className="flex-1 justify-center items-center bg-gray-300">
                <Text className="text-gray-500">No Image</Text>
              </View>
            )}
          </View>

          <View className="flex-row mb-4 justify-between items-center">
            <Text className="text-xl">{productName}</Text>
            {price && (
              <View className="flex-row">
                {/* TODO: show discounted price */}
                {/* <Text className="text-[#888] line-through mt-1.5">€50</Text> */}
                <View className="items-end">
                  <Text className="text-xl">
                    {price.amount.toLocaleString(undefined, {
                      style: 'currency',
                      currency: price.currency_code,
                      currencyDisplay: 'narrowSymbol',
                    })}
                  </Text>
                  {/* TODO: show taxes if needed */}
                  {/* <Text className="text-xs text-gray-400 font-light">
                    Taxes: €0.99
                  </Text> */}
                </View>
              </View>
            )}
          </View>

          <Text className="text-gray-400 text-sm mb-6">{productQuery.data.product.description}</Text>

          {productQuery.data.product.options && (
            <View className="gap-6 mb-4">
              {productQuery.data.product.options.map((option) => (
                <OptionPicker
                  key={option.id}
                  label={option.title}
                  values={(option.values ?? []).map((value) => ({
                    id: value.id,
                    value: value.value,
                  }))}
                  onValueChange={(value) => {
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [option.id]: value.value,
                    }));
                  }}
                  selectedValue={selectedOptions[option.id]}
                />
              ))}
            </View>
          )}

          {/* TODO: add support for fashion starter colors */}
          {/* <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
            colors={[
              { name: 'Black', value: '#000000' },
              { name: 'White', value: '#FFFFFF' },
              { name: 'Navy', value: '#1E3A8A' },
              { name: 'Gray', value: '#6B7280' },
              { name: 'Red', value: '#DC2626' },
            ]}
            className="mb-6"
          />

          <SizePicker
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            sizes={['XS', 'S', 'M', 'L', 'XL']}
            className="mb-4"
          /> */}

          <View className="flex-row items-center gap-4">
            <QuantityPicker quantity={quantity} onQuantityChange={setQuantity} min={1} variant="ghost" />

            <Button
              className="flex-1"
              disabled={!selectedVariant}
              isPending={addToDraftOrder.isPending}
              onPress={() => {
                if (!selectedVariant) {
                  return;
                }

                animateOut(() =>
                  addToDraftOrder.mutate({
                    items: [
                      {
                        quantity,
                        variant_id: selectedVariant.id,
                      },
                    ],
                  }),
                );
              }}
            >
              Add to cart
            </Button>
          </View>
        </ScrollView>
      )}
    </BottomSheet>
  );
}
