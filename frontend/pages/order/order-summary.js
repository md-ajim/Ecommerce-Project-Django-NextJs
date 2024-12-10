
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import OrderSummary from "../../components/order/Ordersummary";
import { useRouter } from "next/router";
import Loading from "../../components/loading";
export default function OrderSummaryPage() {


  return (
    <>
      <OrderSummary />
    </>
  );
}
