declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.module.scss" {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMetaEnv {
  VITE_CONVERTER_URL: string;
}
