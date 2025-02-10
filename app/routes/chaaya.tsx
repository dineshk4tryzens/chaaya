import { useEffect, useState } from "react";
import { NavBar } from "~/components/NavBar";
import { UserName } from "~/components/User";
import { json, NavLink, useLoaderData } from "@remix-run/react";
import ThemeToggleButton from "~/components/ThemeSwitcher";
import useTheme from "~/hooks/useTheme";
import { GetTodaysConsolidatedOrder } from "~/data/order";
// import { WithId } from "mongodb";
import { GetTodaysConsolidatedOrderResult } from "~/types/order";
import {
  Divider,
  IconButton,
  SvgIcon,
  SvgIconProps,
  Tooltip,
  tooltipClasses,
  Typography,
} from "@mui/material";
import MainBackground from "~/components/main/Background";
// import { PieChart } from "@mui/x-charts";

export async function loader() {
  const data: GetTodaysConsolidatedOrderResult =
    (await GetTodaysConsolidatedOrder());
  return json({ ...data });
}

export default function Index() {
  const [windowObject, setWindowObject] = useState<undefined | unknown>();
  const [id, setId] = useState<undefined | string>();
  const [name, setName] = useState<undefined | string>();
  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  const [openPriceTooltip, setOpenPriceTooltip] = useState(false)
  const [openUniqueTooltipIndex, setOpenUniqueTooltipIndex] = useState<
    number | null
  >(null);

  const { theme, toggleTheme } = useTheme(windowObject as Window);
  const data = useLoaderData<GetTodaysConsolidatedOrderResult>();
  const chart: { id: number; value: number; label: string; }[] = [];
  data?.commonDrinks.map((drink, index) => chart.push({
    id: index, value: drink?.count, label: drink?.label
  }))
  data?.uniqueDrinks.map((drink) => chart.push({
    id: chart.length + 1, value: drink?.count, label: drink?.label
  }))

  useEffect(() => {
    setId(localStorage?.getItem("user-id") ?? undefined);
    setName(localStorage?.getItem("user-name") ?? undefined);
    setWindowObject(window);
  }, [windowObject]);

  function InfoIcon(props: SvgIconProps) {
    return (
      <SvgIcon {...props} className="w-full" key={1}>
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path>
      </SvgIcon>
    );
  }

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
                { name && <NavLink
                  to={`/my-orders?user=${id}`}
                  className={"underline underline-offset-4 p-2 rounded-lg bg-clip-border border border-solid border-transparent hover:backdrop-blur-sm dark:text-slate-300"}
                >
                  My Orders
                </NavLink>}
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
          <div className="flex flex-row justify-between gap-5 max-w-screen-xl mx-auto">
            {/* <ViewOrders orders={data?.orders} userId={id} closeEditOrderItemModal={closeEditOrderItemModal}/> */}
            <div
              className={`flex flex-col items-center w-full my-5 max-w-screen-xs p-4 lg:py-4 rounded-xl shadow-md backdrop-saturate-200 bg-opacity-80
    backdrop-blur-md ${theme === "dark" ? 'bg-white/10' : 'bg-gray-400/20'} z-20 dark:text-white`}
            >
              <ul>
                {data?.commonDrinks?.map((drink, index) => (
                  <li
                    key={index}
                    className="list-disc flex flex-row items-center justify-between"
                  >
                    <Typography
                      className="!text-base max-md:!text-xs"
                      key={index}
                      variant="h6"
                    >
                      {drink.label} - {drink.count}
                    </Typography>
                    <Tooltip
                      className="!text-base max-md:!text-xs"
                      id={index.toString()}
                      title={(drink?.emails)?.join(", ")}
                      onClick={() => {
                        if (openUniqueTooltipIndex !== null)
                          setOpenUniqueTooltipIndex(null);
                        return openTooltipIndex === index
                          ? setOpenTooltipIndex(null)
                          : setOpenTooltipIndex(index);
                      }}
                      open={index === openTooltipIndex}
                      placement="right"
                      slotProps={{
                        popper: {
                          sx: {
                            [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                              {
                                marginLeft: '0px',
                              },
                          },
                        },
                      }}
                    >
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </li>
                ))}
                {data?.uniqueDrinks?.map((drink, index) => (
                  <li
                    key={index}
                    className="list-disc flex flex-row items-center justify-between"
                  >
                    <Typography
                      className="!text-base max-md:!text-xs"
                      key={index}
                      variant="h6"
                    >
                      {drink.label} - {drink.count}
                    </Typography>
                    <Tooltip
                      className="!text-base max-md:!text-xs"
                      id={index.toString()}
                      title={(drink?.emails)?.join(", ")}
                      open={openUniqueTooltipIndex === index}
                      placement="right"
                      onClick={() => {
                        if (openTooltipIndex !== null)
                          setOpenTooltipIndex(null);
                        return openUniqueTooltipIndex === index
                          ? setOpenUniqueTooltipIndex(null)
                          : setOpenUniqueTooltipIndex(index);
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                              {
                                marginLeft: '0px',
                              },
                          },
                        },
                      }}
                    >
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`flex flex-col items-center justify-center w-full my-5 p-4 lg:py-4 !text-base max-md:!text-xs rounded-xl shadow-md backdrop-saturate-200 bg-opacity-80 backdrop-blur-md ${theme === "dark" ? 'bg-white/10' : 'bg-gray-400/20'} z-20 dark:text-white`}>
              {/* <div className={"flex w-full flex-row items-center flex-wrap justify-evenly h-full"}> */}
              <div className={"flex flex-wrap items-center justify-evenly gap-5 h-full"}>
                <ul className="mx-auto min-h-[50%]">
                  {(data?.resultOrderInWords)?.map(
                    (drink, index) => (
                      <li key={index}>{drink?.label}</li>
                    )
                  )}
                  <Divider className="w-full text-center !my-2 !border-[#CBD5E1] !opacity-80"/>
                  <div className="flex flex-row just items-baseline justify-between flex-wrap gap-2">
                    <Typography variant="overline">Estimated Total</Typography>
                    <div className="flex">
                      <Typography variant="h4" className="max-sm: text-sm">₹{data?.priceDetails?.total}</Typography>
                      <Tooltip
                        className="!text-base max-md:!text-xs"
                        id='priceTooltip'
                        title={data?.priceDetails?.pricePerItem.map((drink, index) => <p key={index}>{drink?.itemName} - ₹{drink?.itemPrice}</p>)}
                        onClick={() => setOpenPriceTooltip(!openPriceTooltip)}
                        open={openPriceTooltip}
                        placement="bottom-end"
                        slotProps={{
                          popper: {
                            sx: {
                              [`&.${tooltipClasses.popper}[data-popper-placement*="bottom-end"] .${tooltipClasses.tooltip}`]:
                                {
                                  marginLeft: '0px',
                                  maxWidth: '140px'
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
                  </div>
                </ul>
              </div>
            </div>
          </div>
          {data?.finalTotal && <div className={`flex flex-col items-center justify-center w-full my-5 p-4 lg:py-4 !text-base max-md:!text-xs rounded-xl shadow-md backdrop-saturate-200 bg-opacity-80 backdrop-blur-md ${theme === "dark" ? 'bg-white/10' : 'bg-gray-400/20'} z-20 dark:text-white`}>
            {/* <PieChart className={"!w-1/2 max-md:!h-1/3"}
              series={[{
                data: chart,
                // data: [
                //   { id: 0, value: 10, label: 'series A' },
                //   { id: 1, value: 15, label: 'series B' },
                //   { id: 2, value: 20, label: 'series C' },
                // ],
                innerRadius: 30,
                outerRadius: 120,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,
                cx: 180,
                cy: 125,
              }]}
              width={500}
              height={250}
            /> */}
            <Divider className="w-full text-center !my-2 !border-[#CBD5E1] !opacity-80">
              <Typography variant="h4">BILL</Typography>
            </Divider>
            {data?.finalTotal?.map((detail, index) => {
              return <Typography key={index}>{detail?.label} : {detail?.count}</Typography>
            })}
            <div className="flex flex-row just items-baseline justify-between flex-wrap gap-2">
              <Typography variant="overline">Estimated Total</Typography>
              <div className="flex">
                <Typography variant="h4" className="max-sm: text-sm">₹{data?.priceDetails?.total}</Typography>
              </div>
            </div>
          </div>}
        </div>
      </MainBackground>
    </div>
  );
}
