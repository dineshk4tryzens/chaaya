import { useEffect, useState } from "react";
import { NavBar } from "~/components/NavBar";
import { UserName } from "~/components/User";
import { MainContainer } from "~/components/MainContainer";
import { json, NavLink, useActionData, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/node";
import ThemeToggleButton from "~/components/ThemeSwitcher";
import useTheme from "~/hooks/useTheme";
import { Alert, IconButton, SvgIcon, SvgIconProps, Tooltip, tooltipClasses } from "@mui/material";
import { Order } from "~/data/order";
import { RepeatOrderModal } from "~/components/RepeatOrderModal";
import { DrinkDetails } from "~/types/drink";
import MainBackground from "~/components/main/Background";
import { RepeatOrderDetails } from "~/types";
import { UpdateUpiIdModal } from "~/components/UpdateUpiIdModal";


export async function action({ request }: ActionFunctionArgs) {
  const order = await Order(request);
  return json({ data: order, success: order?.success || false });
}

export default function Index() {
  const [windowObject, setWindowObject] = useState<undefined | unknown>();
  const [name, setName] = useState<undefined | string>();
  const [showAlert, setShowAlert] = useState<boolean | undefined>(undefined);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [id, setId] = useState<undefined | string>();
  const [showReorderLink, setShowReorderLink] = useState<boolean>(false);
  const [showRepeatOrderModal, setShowRepeatOrderModal] = useState<boolean>(false);
  const [showReorderTooltip, setShowReorderTooltip] = useState<boolean>(false);
  const [showUpdateUpiID, setShowUpdateUpiID] = useState<boolean>(false);
  const [repeatOrderDetails, setRepeatOrderDetails] = useState<DrinkDetails | undefined>();
  const [userDetails, setUserDetails] = useState<RepeatOrderDetails | undefined>();
  const [upiId, setUpiId] = useState<string | undefined>();
  const { theme, toggleTheme } = useTheme(windowObject as Window);
  const submit = useSubmit();
  const user = useActionData<{
    data?: {
      id?: string;
      email?: string;
      name?: string;
      success?: boolean;
      message?: string;
    };
    success: boolean;
  }>();

  useEffect(() => {
    if (id) {
      CheckIfRepeatOrderExists(id).then((data: RepeatOrderDetails) => (setRepeatOrderDetails(data), setUserDetails(data)))
      setShowReorderLink(true)
    }
  }, [id])

  useEffect(() => {
    if (userDetails && !userDetails?.userData?.upiId) {
      setShowUpdateUpiID(true)
    }
  }, [userDetails])

  async function CheckIfRepeatOrderExists(userId: string) {
    try {
      const response = await fetch(`/api/repeatOrder?id=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      return data
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setWindowObject(window);
    setName(localStorage?.getItem("user-name") ?? undefined);
    setId(localStorage?.getItem("user-id") ?? undefined);
  }, [windowObject]);

  useEffect(() => {
    if (user?.data?.name) {
      setName(user.data?.name);
      setId(user.data?.id);
      localStorage.setItem("user-name", user.data.name);
      user?.data.id && localStorage.setItem("user-id", user.data.id);
      if (user?.success) {
        setSuccess(true);
        setShowAlert(true);
      } else {
        setSuccess(false);
        setShowAlert(true);
      }
    } else {
      if (user?.data) {
        if (user.data?.success) {
          setSuccess(true);
          setShowAlert(true);
        } else {
          setSuccess(false);
          setShowAlert(true);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (showAlert) {
      const timeout = setTimeout(() => {
        setShowAlert(false);
        clearTimeout(timeout);
      }, 6000);
    }
  }, [showAlert]);

  function InfoIcon(props: SvgIconProps) {
    return (
      <SvgIcon {...props} className="w-full">
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path>
      </SvgIcon>
    );
  }

  return (
    <div className={`flex h-screen flex-col`}>
        <MainBackground theme={theme}>
          <div className="h-auto z-20 mr-12 ml-12 max-sm:mr-5 max-sm:ml-5">
            <NavBar>
              <div className="flex w-full justify-between flex-wrap">
                <div className="flex items-center gap-2 font-[Averta] flex-1">
                  <ThemeToggleButton
                    isDark={theme === "dark"}
                    onChange={() => toggleTheme()}
                  />
                  { name && <NavLink
                    to={`/my-orders?user=${id}`}
                    className={"underline underline-offset-4 p-2 rounded-lg bg-clip-border border border-solid border-transparent hover:backdrop-blur-sm dark:text-slate-300"}
                  >
                    My Orders
                  </NavLink>}
                  <NavLink
                    to={`/chaaya`}
                    className={"underline underline-offset-4 p-2 rounded-lg bg-clip-border border border-solid border-transparent hover:backdrop-blur-sm dark:text-slate-300"}
                  >
                    Todays Orders
                  </NavLink>
                  {showReorderLink &&
                    <NavLink
                      onClick={() => setShowRepeatOrderModal(true)}
                      to={'/'}
                      className={"underline underline-offset-4 p-2 rounded-lg bg-clip-border border border-solid border-transparent hover:backdrop-blur-sm dark:text-slate-300"}
                    >
                      <div className="flex flex-row items-center">
                        Repeat Last Order
                        <Tooltip
                          title={`Repeat your last order - ${repeatOrderDetails?.label}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowReorderTooltip(!showReorderTooltip)
                          }}
                          open={showReorderTooltip}
                          placement="bottom"
                          slotProps={{
                            popper: {
                              sx: {
                                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                  {
                                    marginTop: '0px !important',
                                  },
                              },
                            },
                          }}
                        >
                          <IconButton>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </NavLink>
                  }
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
                    { user?.data?.message ?? 'Success. ബാ ഇനി ഓരോ ചായ പിടിപ്പിക്കാം'}
                  </Alert>
                ) : (
                  <Alert className="w-full" severity="error" onClose={() => {}}>
                    Oops!!. Unable to process your request. Try again later!
                  </Alert>
                )}
              </div>
            )}
            <MainContainer id={id} name={name} />
            <RepeatOrderModal
              modalOpen={showRepeatOrderModal || false}
              modalClose={() => setShowRepeatOrderModal(false)}
              id={id}
              label={repeatOrderDetails?.label}
              onSubmit={() => {
                if (!id || !repeatOrderDetails?.name) throw new Error('missing id or drink name');
                const formData = new FormData();
                formData.append("reorder", "true");
                formData.append("id", id);
                formData.append("drink", repeatOrderDetails.name);
                setShowRepeatOrderModal(false);
                submit(formData, {
                  method: "post",
                  encType: "application/x-www-form-urlencoded",
                  // navigate: false,
                });
              }}
            ></RepeatOrderModal>
            { id && showUpdateUpiID &&
              <UpdateUpiIdModal
                modalOpen={true}
                modalClose={() => setShowRepeatOrderModal(false)}
                onUpiIdSelected={setUpiId}
                id={id}
                onSubmit={() => {
                  if (!id || !upiId) throw new Error('missing id or UPI Id');
                  const formData = new FormData();
                  formData.append("upiId", upiId);
                  formData.append("id", id);
                  formData.append("updateUpi", 'true');
                  submit(formData, {
                    method: "post",
                    encType: "application/x-www-form-urlencoded",
                  });
                }}
              />
            }
          </div>
        </MainBackground>
    </div>
  );
}
