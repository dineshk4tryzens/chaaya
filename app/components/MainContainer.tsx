import { Divider, Snackbar, SnackbarCloseReason, Typography } from "@mui/material";
import { ActionAreaCard } from "../components/Card";
import { Listing } from "./Listing";
import { Constants } from "~/data/constants";
import { Drink } from "~/types";
import { Button } from "@mui/base/Button";
import React, { SyntheticEvent, useState } from "react";
import { Form, useSubmit } from "@remix-run/react";
import { LoginAndConfirmModal } from "./LoginAndConfirmModal";
import { DrinkDetails } from "~/types/drink";

export const MainContainer = ({ id, name }: { id?: string, name?: string }) => {
  const [modalOpen, setModalOpen] = useState<boolean | undefined>();
  const [selectedDrinkData, setSelectedDrinkData] = useState<undefined | DrinkDetails>(undefined);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedUserEmpId, setSelectedUserEmpId] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const submit = useSubmit();
  const submitDrinkSelection = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if(!selectedDrinkData) {
      return setOpenSnackbar(true)
    }
    return setModalOpen(true);
  };

  const handleDrinkSelection = (drinkDetails?: {
    name?: string;
    details?: {
      description: string;
      image: string;
      ingredients: string[];
      label: string;
      price: number;
    };
  }) => {
    setSelectedDrinkData({ ...drinkDetails?.details, name: drinkDetails?.name}); // Update the selected drink state in the parent
  };

  const handleClose = (
    event: SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="relative z-10">
      <div className="flex w-full mx-auto my-10 max-w-screen-xl bg-opacity-80 justify-around md:gap-7 xs:gap-2 dark:text-slate-300">
        <div className="flex w-full my-5 max-w-screen-xl relative z-20 max-xs:!min-h-full dark:text-slate-300">
          <div className="text-sm leading-6 w-full">
            <figure className="h-full relative flex flex-col-reverse shadow-md backdrop-saturate-150 bg-opacity-80 backdrop-blur-md bg-white/10 z-20 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
              <blockquote className="mt-6 text-slate-900 dark:text-slate-300">
                <Typography variant="button" className="!text-lg max-md:!text-sm">Welcome</Typography>
                <img className='rounded-lg max-h-52 max-xs:h-32 w-full' src="/namaskaaram.gif" alt="welcome"></img>
              </blockquote>
              <figcaption className="flex items-center space-x-4 flex-1 flex-wrap justify-center">
                <img
                  src="https://images.unsplash.com/photo-1632910121591-29e2484c0259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxjb2RlcnxlbnwwfDB8fHwxNzEwMTY0NjIzfDA&ixlib=rb-4.0.3&q=80&w=1080"
                  alt=""
                  className="flex-none w-14 h-14 rounded-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="flex-auto justify-center">
                  <Typography className="text-base text-slate-900 font-semibold dark:text-slate-200">
                    {name || 'Guest'}
                  </Typography>
                  <Typography
                    variant="overline"
                    gutterBottom
                    sx={{ display: "block" }}
                    className="mt-0.5 text-slate-900 dark:text-slate-400"
                  >
                    Tryzens
                  </Typography>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
        <div
          className="flex w-full my-5 max-w-screen-xl !rounded-xl shadow-md backdrop-saturate-200 bg-opacity-80
      backdrop-blur-md bg-white/10 relative z-20 dark:text-slate-300"
        >
          <ActionAreaCard />
        </div>
      </div>
      <div className="flex w-full flex-col mx-auto my-5 pb-8 max-w-screen-xl bg-opacity-80 justify-around gap-7 dark:text-slate-300">
        <Divider className="w-full text-center mb-5 dark:text-slate-300">
          ORDER BELOW
        </Divider>
        <Form method="post" className="flex flex-col">
          <div className="flex flex-row flex-wrap gap-4 my-4">
            {Object.keys(Constants.Drinks).map((drink, index) => (
              <Listing
                key={index}
                name={drink}
                selectedDrink={selectedDrinkData}
                details={Constants.Drinks[drink as Drink]}
                onDrinkSelected={handleDrinkSelection}
              />
            ))}
          </div>
          <Button
            className="w-[100%] max-w-52 mx-auto h-12 my-5 bg-[#1e293bb5] hover:bg-[#1e293b]"
            type="button"
            onClick={(e) => submitDrinkSelection(e)}
          >
            Proceed!
          </Button>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={handleClose}
            message="Please enter a drink!"
          />
          <LoginAndConfirmModal
            modalOpen={modalOpen || false}
            modalClose={() => setModalOpen(false)}
            onEmailSelected={setSelectedUserEmail}
            onEmpIdSelected={setSelectedUserEmpId}
            id={id}
            onSubmit={() => {
              const formData = new FormData();
              formData.append("drink", JSON.stringify(selectedDrinkData));
              if (id) {
                formData.append("id", id);
              } else {
                formData.append("email", selectedUserEmail);
                formData.append("empId", selectedUserEmpId);
              }
              setModalOpen(false);
              submit(formData, {
                method: "post",
                encType: "application/x-www-form-urlencoded",
              });
            }}
          ></LoginAndConfirmModal>
        </Form>
      </div>
    </div>
  );
};
