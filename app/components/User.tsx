
import { Typography } from "@mui/material";
import { useScramble } from "use-scramble";

declare module '@mui/material/styles' {
  interface TypographyVariants {
    poster: React.CSSProperties;
  }

  // allow configuration using `createTheme()`
  interface TypographyVariantsOptions {
    poster?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    poster: true;
    h3: false;
  }
}

export const UserName = (props: { className?: string, name?: string }) => {
  const className = props?.className
  const name = props?.name
  // hook returns a ref
  const { ref, replay } = useScramble({
    text: `Hello${name ? ` ${name}` : ', പുതിയ ആൾ ആണല്ലേ'}!!!`,
    speed: 0.3
  });

  // apply the ref to a node
  return <Typography variant="h6" ref={ref} onMouseEnter={replay} className={className}></Typography>;
};
