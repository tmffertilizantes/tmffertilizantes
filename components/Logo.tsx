import Image from "next/image";
import { useRouter } from "next/router";

interface LogoProps {
  theme?: string;
}

export default function Logo(props: LogoProps) {

	var logo_src = "/logotmf.png";

	if(props.theme === "white") {
		logo_src = "/logotmf_white.png"
	}

  return <Image src={logo_src} width={367} height={212} alt="Logo TMF" />;
}
