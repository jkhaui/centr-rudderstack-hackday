import React from "react";
import Image from "next/image";

interface MemberProps {
  avatarUrl?: string;
  name?: string;
}

const Member = ({ avatarUrl = "/noname.png", name = "" }: MemberProps) => {
  return (
    <div className="flex w-fit items-center bg-white rounded-full pl-1 pr-4 py-1 gap-1">
      <div className="flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full">
        <Image src={avatarUrl} alt={name} width={32} height={32} />
      </div>
      <div>
        <h6 className="text-lg font-bold">{name}</h6>
      </div>
    </div>
  );
};

export default Member;
