import { useEffect, useState } from "react";
import { NavBar } from "~/components/NavBar";
import { UserName } from "~/components/User";
import { json, NavLink, useActionData, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import ThemeToggleButton from "~/components/ThemeSwitcher";
import useTheme from "~/hooks/useTheme";
import { Alert } from "@mui/material";
import { GetOrders, Order } from "~/data/order";
import { ViewOrders } from "~/components/ViewOrders";
import { WithId } from "mongodb";
import MainBackground from "~/components/main/Background";

export async function action({ request }: ActionFunctionArgs) {
  const data = await Order(request);
  return json({ data, success: data?.success || false });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const orders = await GetOrders(request) as WithId<{
    email?: string;
    empId?: string;
    id?: string;
    orderDetails?: { item?: string, orderDate?: string, price?: number }[];
  }>
  return json({ orders: orders?.orderDetails });
}

export default function Index() {
  const [windowObject, setWindowObject] = useState<undefined | unknown>();
  const [name, setName] = useState<undefined | string>();
  const [showAlert, setShowAlert] = useState<boolean | undefined>(undefined);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [id, setId] = useState<undefined | string>();
  const [closeEditOrderItemModal, setCloseEditOrderItemModal] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme(windowObject as Window);
  const data = useLoaderData<{
    orders?: {
      item?: string;
      orderDate?: string;
    }[];
  }>();

  const user = useActionData<{
    data?: {
      id?: string;
      email?: string;
      name?: string;
      closeEditOrderItemModal?: boolean;
    };
    success: boolean;
    closeEditOrderItemModal: boolean;
  }>();

  useEffect(() => {
    setName(localStorage?.getItem("user-name") ?? undefined);
    const userId = (localStorage?.getItem("user-id") ?? undefined);
    if (localStorage?.getItem("user-id")) {
      setId(localStorage?.getItem("user-id") ?? undefined);
      const url = new URL(window.location.href);
      if(!url?.searchParams?.get('user') && userId) {
        url.searchParams.set('user', userId)
        window.history.replaceState({}, "", url.toString());
        window.location.reload();
      }
    }
    setWindowObject(window);
  }, [windowObject]);

  useEffect(() => {
    if (user?.data?.closeEditOrderItemModal) {
      setCloseEditOrderItemModal(true)
    }
    if (user?.data?.name) {
      setName(user.data?.name);
      localStorage.setItem("user-name", user.data.name);
      user?.data.id && localStorage.setItem("user-id", user.data.id);
      if (user?.success) {
        setSuccess(true);
        setShowAlert(true);
      } else {
        setSuccess(true);
        setShowAlert(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
        clearTimeout(timeout);
      }, 5000);
    }
  }, [showAlert]);

  return (
    <div className={`flex h-screen flex-col`}>
      <MainBackground theme={theme}>
        <div className="z-20 mr-12 ml-12 h-full">
          <NavBar>
            <div className="flex w-full justify-between flex-wrap">
              <div className="flex items-center gap-2 font-[Averta] flex-1">
                <ThemeToggleButton
                  isDark={theme === "dark"}
                  onChange={() => toggleTheme()}
                />
                <NavLink
                  to="/"
                  className={
                    "underline underline-offset-4 p-2 rounded-lg bg-clip-border border border-solid border-transparent hover:backdrop-blur-sm dark:text-slate-300"
                  }
                >
                  Order Now
                </NavLink>
                <NavLink
                  to={`/chaaya`}
                  className={"underline underline-offset-4 p-2 rounded-lg bg-clip-border border border-solid border-transparent hover:backdrop-blur-sm dark:text-slate-300"}
                >
                  Todays Orders
                </NavLink>
              </div>
              <div className="content-center">
                {/* // check user logged in and show username or register */}
                <UserName
                  className="content-center font-[Averta] dark:text-slate-300"
                  name={name}
                />
              </div>
            </div>
          </NavBar>
          {showAlert && (
            <div className="sticky top-[7%] flex w-full mx-auto max-w-screen-xl py-2 lg:py-4 rounded-xl z-20 dark:text-white">
              {success ? (
                <Alert className="w-full" severity="success" onClose={() => {}}>
                  This Alert displays the default close icon.
                </Alert>
              ) : (
                <Alert className="w-full" severity="error" onClose={() => {}}>
                  This Alert displays the default close icon.
                </Alert>
              )}
            </div>
          )}
          <ViewOrders orders={data?.orders} userId={id} closeEditOrderItemModal={closeEditOrderItemModal}/>
        </div>
      </MainBackground>
    </div>
  );
}
