// Path: jeevansetu-frontend/src/components/dashboard/AddressBlock.jsx
import React from "react";
import { FiMapPin } from "react-icons/fi";

const AddressBlock = ({ address }) => {
  if (!address) {
    return <p className="text-white/40 italic">Not provided</p>;
  }

  const line1 = address?.line1?.trim();
  const line2 = address?.line2?.trim();
  const postal = address?.postalCode?.trim();

  const line = [line1, line2].filter(Boolean).join(", ");

  return (
    <div className="flex items-start gap-2">
      <FiMapPin className="mt-1 text-indigo-400 shrink-0" />
      <div>
        <p className="text-indigo-100 font-medium">{line || <span className="text-white/40 italic">Street address not provided</span>}</p>
        {postal && (
          <p className="text-indigo-200/60 text-sm mt-0.5">Postal Code: <span className="text-white/80">{postal}</span></p>
        )}
      </div>
    </div>
  );
};

export default AddressBlock;
