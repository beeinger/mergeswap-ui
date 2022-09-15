import Image, { ImageProps } from "next/image";

import styled from "@emotion/styled";

const LogoImage = ({ className, ...props }: Partial<ImageProps>) => (
  <div className={className}>
    <Image
      {...{
        src: "/logo.svg",
        height: 60,
        width: 60,
        alt: "logo",
        ...props,
      }}
    />
  </div>
);

const Logo = styled(LogoImage)`
  opacity: 0.8;

  position: fixed;
  top: 12px;
  left: 12px;

  width: 60px;
  height: 60px;
`;

export default Logo;
