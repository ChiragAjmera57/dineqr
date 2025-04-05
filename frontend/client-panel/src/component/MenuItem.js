import  { useState } from 'react';

const MenuItem = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  const description =
    'Grilled cheese sandwich sfnlsjdflsfnjfn with mayo on fsefnesjk fsjdkbf f fjs bsdkfkj v kf sbfkjjskdnfo k kfj sd fn sojfb';

  const isToggleable = description.length > 60; // Check if description is longer than 40 characters

  return (
    <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
      <p className="font-medium text-[#171717] text-[15px]">Honey Chilly Potato</p>
      <div className="w-[220px]">
        <p
          className={`font-[300] text-[13px] ${isToggleable ? 'cursor-pointer' : ''}`}
          onClick={isToggleable ? toggleDescription : undefined} // Add toggle only if toggleable
        >
          {isToggleable
            ? isExpanded
              ? description
              : `${description.slice(0, 30)}...`
            : description}
          {isToggleable && (
            <span className="text-blue-500 ml-1">
              {isExpanded ? 'Read less' : 'Read more'}
            </span>
          )}
        </p>
      </div>
      <p className="font-light text-[14px]">₹180.00</p>
    </div>
  );
};

export default MenuItem;