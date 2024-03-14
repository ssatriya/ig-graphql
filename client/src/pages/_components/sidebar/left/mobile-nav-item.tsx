"use client";

import { NavLink } from "react-router-dom";

import { Button } from "@/components/ui/button";

type ButtonProps = {
  type: "button";
  children: React.ReactNode;
  onClick: () => void;
};

type AnchorProps = {
  type: "link";
  children: React.ReactNode;
  href: string;
};

const MobileNavItem = (props: ButtonProps | AnchorProps) => {
  if (props.type === "link") {
    const { href, children } = props as AnchorProps;
    return (
      <Button
        variant="nav"
        className="my-[2px] p-3 flex items-center justify-start rounded-lg group h-12 w-12"
        asChild
      >
        <NavLink to={href}>{children}</NavLink>
      </Button>
    );
  }

  if (props.type === "button") {
    const { onClick, children } = props as ButtonProps;
    return (
      <Button
        variant="nav"
        className="my-[2px] p-3 flex items-center justify-start rounded-lg group h-12 w-12"
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }

  throw new Error("Invalid prop type passed to NavItem");
};
export default MobileNavItem;
