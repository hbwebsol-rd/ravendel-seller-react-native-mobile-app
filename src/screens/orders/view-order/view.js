import React, {useEffect, useState} from 'react';
import {
  OrdersWrapper,
  OrderViewCardTitle,
  OrderViewCard,
  OrderInfoVal,
  OrderInfoLabel,
  OrderInfoRow,
  ShippingName,
  ShippingDetails,
  OrderDetailRow,
  OrderDetailLeftCol,
  OrderDetailRightCol,
  ProductName,
  ProductQty,
  ProductPrice,
  OrderAmountRow,
  OrderAmountLabel,
  OrderAmountValue,
} from './styles';
import BottomDivider from '../../components/bottom-divider';
import moment from 'moment';
import {useQuery} from '@apollo/client';
import {GET_ORDER} from '../../../queries/orderQueries';
import {formatCurrency, isEmpty} from '../../../utils/helper';
import {Text} from '@rneui/base';
import AppLoader from '../../components/loader';
import {useSelector} from 'react-redux';

const OrderView = ({navigation, orderDetail}) => {
  console.log(orderDetail.id);
  const {loading, error, data, refetch} = useQuery(GET_ORDER, {
    notifyOnNetworkStatusChange: true,
    variables: {id: orderDetail.id},
  });
  const {currencyOptions, currencySymbol} = useSelector(
    state => state.dashboard,
  );
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (data?.order) {
      setOrderData(data.order.data);
    }
  }, [data]);

  if (loading || isEmpty(orderData)) {
    return <AppLoader />;
  }

  return (
    <OrdersWrapper>
      <OrderViewCard>
        <OrderViewCardTitle>Order Info</OrderViewCardTitle>
        <OrderInfoRow>
          <OrderInfoLabel>Order No.</OrderInfoLabel>
          <OrderInfoVal>{orderDetail.orderNumber}</OrderInfoVal>
        </OrderInfoRow>
        <OrderInfoRow>
          <OrderInfoLabel>Date</OrderInfoLabel>
          <OrderInfoVal>
            {moment(orderDetail.date).format('d/M/Y H:m a')}
          </OrderInfoVal>
        </OrderInfoRow>
        <OrderInfoRow>
          <OrderInfoLabel>Total</OrderInfoLabel>
          <OrderInfoVal>
            {formatCurrency(
              orderData?.totalSummary?.grandTotal,
              currencyOptions,
              currencySymbol,
            )}
          </OrderInfoVal>
        </OrderInfoRow>
        <OrderInfoRow>
          <OrderInfoLabel>Payment Method</OrderInfoLabel>
          <OrderInfoVal>{orderDetail.billing.paymentMethod} </OrderInfoVal>
        </OrderInfoRow>
      </OrderViewCard>

      <OrderViewCard>
        <OrderViewCardTitle>Shipping Info</OrderViewCardTitle>
        <ShippingName>
          {orderData.shipping.firstname + ' ' + orderData.shipping.lastname}
        </ShippingName>
        <ShippingDetails>{orderData.shipping.email}</ShippingDetails>
        <ShippingDetails>{orderData.shipping.phone}</ShippingDetails>
        <ShippingDetails>{orderData.shipping.address}</ShippingDetails>
        <ShippingDetails>
          {orderData.shipping.city}, {orderData.shipping.state},{' '}
          {orderData.shipping.country}
        </ShippingDetails>
      </OrderViewCard>

      <OrderViewCard>
        <OrderViewCardTitle>Billing Info</OrderViewCardTitle>
        <ShippingName>
          {orderData.billing.firstname + ' ' + orderData.billing.lastname}
        </ShippingName>
        <ShippingDetails>{orderData.billing.email}</ShippingDetails>
        <ShippingDetails>{orderData.billing.phone}</ShippingDetails>
        <ShippingDetails>{orderData.billing.address}</ShippingDetails>
        <ShippingDetails>
          {orderData.billing.city}, {orderData.billing.state},{' '}
          {orderData.billing.country}
        </ShippingDetails>
      </OrderViewCard>
      <OrderViewCard>
        <OrderViewCardTitle>Order Details</OrderViewCardTitle>
        {!isEmpty(orderData) &&
          orderData.products.map(item => (
            <OrderDetailRow>
              <OrderDetailLeftCol style={{width: '70%'}}>
                <Text>{item.productTitle}</Text>
                <Text>x{item.qty}</Text>
              </OrderDetailLeftCol>
              <OrderDetailRightCol>
                <ProductPrice>
                  {formatCurrency(item.total, currencyOptions, currencySymbol)}
                </ProductPrice>
              </OrderDetailRightCol>
            </OrderDetailRow>
          ))}

        <OrderAmountRow>
          <OrderAmountLabel>Subtotal</OrderAmountLabel>
          <OrderAmountValue>
            {formatCurrency(
              orderData?.totalSummary?.mrpTotal,
              currencyOptions,
              currencySymbol,
            )}
          </OrderAmountValue>
        </OrderAmountRow>

        <OrderAmountRow>
          <OrderAmountLabel>Tax</OrderAmountLabel>
          <OrderAmountValue>
            {formatCurrency(
              orderData?.totalSummary?.totalTax,
              currencyOptions,
              currencySymbol,
            )}
          </OrderAmountValue>
        </OrderAmountRow>

        <OrderAmountRow>
          <OrderAmountLabel>Shipping</OrderAmountLabel>
          <OrderAmountValue>
            {formatCurrency(
              orderData?.totalSummary?.totalShipping,
              currencyOptions,
              currencySymbol,
            )}
          </OrderAmountValue>
        </OrderAmountRow>

        <OrderAmountRow>
          <OrderAmountLabel>Total</OrderAmountLabel>
          <OrderAmountValue>
            {' '}
            {formatCurrency(
              orderData?.totalSummary?.grandTotal,
              currencyOptions,
              currencySymbol,
            )}
          </OrderAmountValue>
        </OrderAmountRow>
      </OrderViewCard>

      <BottomDivider />
    </OrdersWrapper>
  );
};

export default OrderView;
