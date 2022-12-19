import { useState } from "react";

interface Props {
  title: string;
  icon?: any;
  id: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function NavLinkCollapse(props: Props) {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggleLink = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <a
        href="#"
        className={`nav-link ${collapsed ? "collapsed" : ""} ${
          props.disabled ? "disabled" : ""
        }`}
        data-bs-toggle="collapse"
        aria-expanded={collapsed}
        aria-controls={props.id}
        onClick={handleToggleLink}
      >
        {props.icon}
        {props.title}
      </a>

      <div
        id={props.id}
        className={`collapse ${
          collapsed === false ? "show" : ""
        }`}
      >
        {props.children}
      </div>
    </>
  );
}
