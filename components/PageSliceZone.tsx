import { Fragment } from "react";
import {
  SliceZone,
  type SliceLike,
  type SliceZoneProps,
} from "@prismicio/react";

function getSliceType(slice: SliceLike) {
  return "slice_type" in slice ? slice.slice_type : slice.type;
}

function getSliceKey(slice: SliceLike, index: number) {
  return "id" in slice && slice.id
    ? slice.id
    : `${getSliceType(slice)}-${index}`;
}

/**
 * Renders page slices while grouping each adjacent Hero + Breadcrumb pair.
 */
export default function PageSliceZone({
  slices = [],
  ...sliceZoneProps
}: SliceZoneProps) {
  const renderedSlices = [];

  for (let index = 0; index < slices.length; index += 1) {
    const slice = slices[index];
    const nextSlice = slices[index + 1];
    const isHeroBreadcrumbPair =
      getSliceType(slice) === "hero_banner" &&
      nextSlice &&
      getSliceType(nextSlice) === "breadcrumb";

    if (isHeroBreadcrumbPair) {
      renderedSlices.push(
        <div className="hero-breadcrumb-group" key={getSliceKey(slice, index)}>
          <SliceZone
            {...sliceZoneProps}
            slices={[slice, nextSlice]}
          />
        </div>,
      );
      index += 1;
      continue;
    }

    renderedSlices.push(
      <Fragment key={getSliceKey(slice, index)}>
        <SliceZone {...sliceZoneProps} slices={[slice]} />
      </Fragment>,
    );
  }

  return <>{renderedSlices}</>;
}
