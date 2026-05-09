import "./Layout.css";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  return <div className="layout-container">{children}</div>;
};
