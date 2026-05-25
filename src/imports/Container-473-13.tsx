import imgImageLogo from "figma:asset/009541fc5d689d29107b655d2b8ecd57f6d4b3ff.png";

function ImageLogo() {
  return (
    <div className="h-full relative rounded-[4px] shrink-0 w-[42px]" data-name="Image (Logo)">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none rounded-[4px]">
        <img alt="" className="absolute h-[60.4%] left-[1.84%] max-w-none top-[14.52%] w-[81.53%]" src={imgImageLogo} />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[19.98px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-normal leading-[20px] left-0 text-[#0f172b] text-[16px] text-nowrap top-[-2.25px]">Kho DLDC</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[15.977px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="font-normal leading-[16px] relative shrink-0 text-[#62748e] text-[12px] text-nowrap">Hệ thống quản lý Bộ Tư Pháp</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[35.957px] relative shrink-0 w-[91.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container />
        <Container1 />
      </div>
    </div>
  );
}

export default function Container3() {
  return (
    <div className="content-stretch flex gap-[11.992px] items-center pb-[1.25px] pl-[23.984px] pr-0 pt-0 relative size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e2e8f0] border-[0px_0px_1.25px] border-solid inset-0 pointer-events-none" />
      <ImageLogo />
      <Container2 />
    </div>
  );
}