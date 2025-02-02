import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import { ListingComponentProps } from "~/types/components/listing";
import ListingInfo from "../components/ListingInfo";

export const Listing = (props: ListingComponentProps) => {
  const [drink, setDrink] = useState<string>('');
  const handleDrinkSelection = ({name}: {name: string}) => {
    setDrink(name)
    props.onDrinkSelected(props);
  }

  return(
  <div
    className="flex max-w-screen-xl !rounded-xl hover:cursor-pointer hover:backdrop-blur-2xl dark:text-white"
    onClick={() => handleDrinkSelection(props)}
    role="presentation"
  >
    <div className="flex h-min w-auto max-w-[350px] !rounded-xl shadow-md backdrop-saturate-200 bg-opacity-80
      backdrop-blur-md text-black bg-black/15 relative z-20 dark:text-white">
      <Card className="flex bg-transparent !rounded-xl" style={{'background': 'transparent'}}>
        <input type="radio" className="ml-4 hover:cursor-pointer" name="drink"
          onChange={() => handleDrinkSelection(props)} checked={props?.selectedDrink?.name === drink}
          value={props?.selectedDrink?.name as string}
          required
        />
        <Box className="flex flex-col">
          <CardContent className="!flex !flex-[1_0_auto] dark:text-slate-300 !py-5">
            <Typography component="div" variant="h6" fontFamily={'Averta'}>
              {props?.details?.label}
            </Typography>
            <ListingInfo {...props}></ListingInfo>
          </CardContent>
        </Box>
      </Card>
    </div>
  </div>
)};
