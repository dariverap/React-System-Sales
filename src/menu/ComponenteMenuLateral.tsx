import "./style.css";
import { SidebarData } from "./SIdebarData";
import Submenu from "./Submenu";
import React, { useState } from "react";
import sizeConfigs from "../configs/sizeConfigs";
import colorConfigs from "../configs/colorConfigs";
import styled from "styled-components";
import { IconContext } from "react-icons/lib";

const SidebarNav = styled.nav`
  background: ${colorConfigs.sidebar.bg};
  width: ${sizeConfigs.sidebar.width};
  min-width: ${sizeConfigs.sidebar.minWidth};
  height: 100dvh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  padding: 7px;
`;

const SidebarWrap = styled.div`
  position: sticky;
  width: 100%;
  margin-top: 66px;
  border: 1px solid #ff6600;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 3px;
  padding: 3px;
`;

export default function ComponenteMenuLateral() {
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <SidebarNav>
          <SidebarWrap>
            {SidebarData.map((item, index) => {
              return <Submenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
}
