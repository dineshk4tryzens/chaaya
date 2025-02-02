import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export const ActionAreaCard = () => {
  return (
    <>
    <Card sx={{ maxWidth: '100%' }} className="w-full !bg-transparent !rounded-xl">
      <CardMedia
        style={{ 'minHeight': '130px', 'height': 'calc(100% - 130px)'}}
        className="bg-[100%_200%] bg-cover rounded-lg"
        image="/card.jpg"
        title="green iguana"
      />
      <CardContent className="!rounded-xl min-h-[150px]">
        <Typography gutterBottom variant="h4" component="div" className="py-2 max-md:!text-sm dark:text-slate-300">
          Chaaya 🥃 ノ ചായ
        </Typography>
        <Typography variant="caption" className="!text-slate-900 !text-base max-md:!text-xs dark:!text-slate-300">
          3:30 PM, The call of chaaya and kadi!
        </Typography>
      </CardContent>
    </Card>
    </>
  );
}