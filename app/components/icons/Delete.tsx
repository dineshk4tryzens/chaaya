import { SvgIcon, SvgIconProps } from "@mui/material";

export default function DeleteIcon(props: SvgIconProps) {
  return (
    <SvgIcon
    {...props}
    className="!w-[35px] !h-full max-h-[35px] p-1.5 mx-auto hover:bg-[#5154624a] rounded-full cursor-pointer dark:text-slate-300"
  >
    <path d="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z" />
  </SvgIcon>
  )
}