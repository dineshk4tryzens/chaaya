import { useState } from 'react';
import { Box, Chip, Divider, Modal, SvgIcon, SvgIconProps, Typography } from '@mui/material';

export default function ListingInfo(props?: { details?: { label?: string; description?: string; image?: string; ingredients?: string[]; price?: number }}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    return
  };

  const handleClose = () => {
    setOpen(false);
    return
  };

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



  function InfoIcon(props: SvgIconProps) {
    return (
      <SvgIcon {...props} className="w-full">
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path>
      </SvgIcon>
    );
  }

  return (
    <div className='w-5 h-full content-center mx-2'>
      <InfoIcon onClick={handleClickOpen}/>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        className={"relative z-50"}
        disableEnforceFocus
      >
      <Box sx={style} className={'flex flex-col text-center justify-center items-center rounded-xl !border-0 dark:!bg-slate-800 backdrop-blur-md'}>
        <Typography id="modal-modal-title" variant="h6" component="h2" className='!mb-2 uppercase dark:text-slate-400'>
          {props?.details?.label}
        </Typography>
        <div className='h-full w-full'>
          <Box
            component="img"
            sx={{
              maxWidth: { xs: 350, md: 350 },
            }}
            className='my-2 rounded-md w-full h-full'
            alt={props?.details?.label}
            src={props?.details?.image}
          />
        </div>
        <Chip label={`₹ ${props?.details?.price}`} variant='outlined' className='!text-lg dark:!text-slate-400'/>
        <Typography id="modal-modal-description" sx={{ my: 2 }} fontStyle={'italic'} className='uppercase leading-4 dark:text-slate-400' variant='button'>
          {props?.details?.description}
        </Typography>
        <Divider className='!mb-4 w-full h-[32px] dark:text-slate-400 before:!border-t-slate-700 after:!border-t-slate-700'>
          <Typography variant="overline" gutterBottom sx={{ display: 'block' }}>INGREDIENTS</Typography>
        </Divider>
          {props?.details?.ingredients?.map((item, index) => <Typography key={index} className='first-letter:uppercase leading-8 dark:text-slate-400' variant="poster">{item}</Typography>)}
      </Box>
      </Modal>
    </div>
  );
}
