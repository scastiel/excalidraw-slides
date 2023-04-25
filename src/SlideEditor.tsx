import React, { useEffect, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { Slide } from "./types";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

export interface Props {
  slide: Slide;
  editMode: boolean;
  onSlideChange: (elements: readonly ExcalidrawElement[]) => void;
}

const sameElement = (el1: any, el2: any) => {
  const {
    version: el1Version,
    versionNonce: el1VersionNonce,
    seed: el1Seed,
    ...el1Attributes
  } = el1;
  const {
    version: el2Version,
    versionNonce: el2VersionNonce,
    seed: el2Seed,
    ...el2Attributes
  } = el2;
  return JSON.stringify(el1Attributes) === JSON.stringify(el2Attributes);
};

const sameElements = (
  elements1: readonly ExcalidrawElement[],
  elements2: readonly ExcalidrawElement[]
) =>
  elements1.length === elements2.length &&
  elements1.every((el, index) => sameElement(el, elements2[index]));

export const SlideEditor = ({ slide, editMode, onSlideChange }: Props) => {
  const [initialElements, setInitialElements] = useState(slide.elements);

  const onChange = (elements: readonly ExcalidrawElement[]) => {
    if (initialElements && !sameElements(elements, initialElements)) {
      onSlideChange(elements);
      setInitialElements(JSON.parse(JSON.stringify(elements)));
    }
  };

  // const [dimensions, setDimensions] = useState({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });

  // const onResize = () => {
  //   setDimensions({
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   });
  // };

  useEffect(() => {
    // window.addEventListener("resize", onResize);
    // return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {!editMode && (
        <style>{`
        .excalidraw .App-menu,
          footer.layer-ui__wrapper__footer {
          display: none
        }
        `}</style>
      )}
      <style>
        {`
          .excalidraw .App-menu_top > *:first-child > *:first-child {
            display: none
          }
        `}
      </style>
      <Excalidraw initialData={slide} onChange={onChange} />
    </div>
  );
};
