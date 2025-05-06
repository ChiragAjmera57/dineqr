import React from "react";

const componentsMap = {
  pending: () => (
    <span className="inline-block items-center text-center self-start rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-900/7 ring-inset border-none">
      Pending
    </span>
  ),
  completed: () => (
    <span className="inline-block items-center text-center self-start rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800 ring-1 ring-green-900/7 ring-inset border-none">
      Completed
    </span>
  ),
  cancelled: () => (
    <span className="inline-block items-center text-center self-start rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800 ring-1 ring-red-900/7 ring-inset border-none">
      Cancelled
    </span>
  ),
};

const BadgeRender = ({ type }) => {
  const BadgeComponent = componentsMap[type]; // Dynamically get the badge component
  return BadgeComponent ? <BadgeComponent /> : null; // Render the badge or null if type is invalid
};

export default BadgeRender;