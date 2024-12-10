import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Loading from "../loading";

const OrderList = ({ get_items }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const totalPages = Math.ceil(get_items.length / itemsPerPage);


  const currentItems = get_items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {

      router.push('/');

    }
  }, [status]);

  if (status === "loading") {
    return <Loading />;
  }



  return (
    <div className="container mx-auto p-4 dark:bg-black/85 ">
      {currentItems.length > 0 ? (
        <div className="dark:bg-black text-gray-800 bg-white dark:text-white shadow-md rounded-lg p-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-4">
            Order List
          </h1>
          <div className="overflow-x-auto rounded-lg">
            <div className="h-[400px] lg:h-[600px] overflow-y-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-700 ">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Order Number
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Image
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Product Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Color
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Size
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Payment
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Date
                    </th>

                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Currency
                    </th>
                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      discount Price
                    </th>

                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Standard
                    </th>

                    <th className="px-4 py-2 text-left text-xs sm:text-sm font-medium text-gray-300">
                      Total
                    </th>
                    {/* <th className="px-4 py-2"></th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentItems.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-700 hover:text-white ">
                      <td className="px-4 py-2 text-xs sm:text-sm">{`#${order?.order_id}`}</td>
                      <td className="px-4 py-2">
                        <img
                          src={order?.items?.product?.images}
                          alt="Product"
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
                        />
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order?.items?.product?.name}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order?.items?.product?.quantity}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order?.items?.product?.metadata.color}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order.items.product.metadata.size}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order.payment_method_types}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order.payment_status}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order.created_at}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order.currency}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        {order.items?.product?.price}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        3-5 business days for delivery. charges 5.00{" "}
                      </td>
                      <td className="px-4 py-2 text-xs sm:text-sm">
                        ${order.amount_total}.00
                      </td>
                      {/* <td className="px-4 py-2">
                        <a
                          onClick={() =>
                            router.push(`/product_id?id=${order.product_id}`)
                          }
                          href="#"
                          className="text-blue-400 hover:underline text-xs sm:text-sm"
                        >
                          View Product &raquo;
                        </a>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between mt-4">
            <button
              className="px-3 py-2 text-sm text-gray-300 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt; Back
            </button>
            <div className="flex flex-wrap gap-1">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === page + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
            </div>
            <button
              className="px-3 py-2 text-sm  text-gray-600 dark:text-gray-300 hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next &gt;
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-lg sm:text-2xl font-semibold mb-2">
            No orders found
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            You have not made any orders yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderList;
