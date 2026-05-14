import clsx from "clsx";
import svgPaths from "./svg-ln74ru5xfu";
type Wrapper1Props = {
  additionalClassNames?: string;
};

function Wrapper1({ children, additionalClassNames = "" }: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div className={clsx("h-[39.986px] relative rounded-[10px] shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[20px] relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">{children}</div>
    </div>
  );
}
type ContainerProps = {
  additionalClassNames?: string;
};

function Container({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerProps>) {
  return (
    <div className={clsx("relative shrink-0 w-full", additionalClassNames)}>
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between relative size-full">{children}</div>
      </div>
    </div>
  );
}

function IconVector({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute inset-1/4">
      <div className="absolute inset-[-8.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
          {children}
        </svg>
      </div>
    </div>
  );
}
type TextText1Props = {
  text: string;
  additionalClassNames?: string;
};

function TextText1({ text, additionalClassNames = "" }: TextText1Props) {
  return (
    <Wrapper additionalClassNames={additionalClassNames}>
      <p className="font-normal leading-[20px] relative shrink-0 text-[#0f172b] text-sm">{text}</p>
    </Wrapper>
  );
}
type TextTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextText({ text, additionalClassNames = "" }: TextTextProps) {
  return (
    <Wrapper additionalClassNames={additionalClassNames}>
      <p className="font-normal leading-[20px] relative shrink-0 text-[#45556c] text-sm">{text}</p>
    </Wrapper>
  );
}

export default function Component41322Dsdl0101ManXemChiTitThongTinDiSoat() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="4.1.3.2.2. DSDL01_01. Màn xem chi tiết thông tin đối soát">
      <div className="h-[84.872px] relative shrink-0 w-[895.994px]" data-name="Container">
        <div aria-hidden="true" className="absolute border-[#e2e8f0] border-b-[0.909px] border-solid inset-0 pointer-events-none" />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[0.909px] px-[23.991px] relative size-full">
          <div className="h-[51.974px] relative shrink-0 w-[190.341px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.991px] items-start relative size-full">
              <div className="h-[27.983px] relative shrink-0 w-full" data-name="Heading 3">
                <p className="absolute font-normal leading-[28px] left-0 text-[#0f172b] text-[18px] top-[-1.18px]">Chi tiết bản ghi đối soát</p>
              </div>
              <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
                <p className="flex-[1_0_0] font-normal leading-[20px] min-h-px min-w-px relative text-[#62748e] text-sm whitespace-pre-wrap">CSDL-HT-2024-12</p>
              </div>
            </div>
          </div>
          <div className="relative rounded-[10px] shrink-0 size-[35.994px]" data-name="Button">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.997px] px-[7.997px] relative size-full">
              <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
                <IconVector>
                  <path d={svgPaths.p354ab980} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </IconVector>
                <IconVector>
                  <path d={svgPaths.p2a4db200} id="Vector" stroke="var(--stroke-0, #62748E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </IconVector>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[521.236px] relative shrink-0 w-[895.994px]" data-name="Container">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[23.991px] items-start overflow-clip pt-[23.991px] px-[23.991px] relative rounded-[inherit] size-full">
          <div className="h-[207.543px] relative shrink-0 w-full" data-name="Container">
            <div className="absolute bg-[#eff6ff] content-stretch flex flex-col gap-[3.991px] h-[85.781px] items-start left-0 pb-[0.909px] pt-[16.903px] px-[16.903px] rounded-[10px] top-0 w-[416.009px]" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#bedbff] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
              <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
                <p className="flex-[1_0_0] font-normal leading-[20px] min-h-px min-w-px relative text-[#1447e6] text-sm whitespace-pre-wrap">Mã bộ dữ liệu</p>
              </div>
              <div className="h-[27.983px] relative shrink-0 w-full" data-name="Container">
                <p className="absolute font-normal leading-[28px] left-0 text-[#1c398e] text-[18px] top-[-1.18px]">CSDL-HT-2024-12</p>
              </div>
            </div>
            <div className="absolute bg-[#faf5ff] content-stretch flex flex-col gap-[3.991px] h-[85.781px] items-start left-[432px] pb-[0.909px] pt-[16.903px] px-[16.903px] rounded-[10px] top-0 w-[416.009px]" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#e9d4ff] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
              <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
                <p className="flex-[1_0_0] font-normal leading-[20px] min-h-px min-w-px relative text-[#8200db] text-sm whitespace-pre-wrap">Tên bộ dữ liệu</p>
              </div>
              <div className="h-[27.983px] relative shrink-0 w-full" data-name="Container">
                <p className="absolute font-normal leading-[28px] left-0 text-[#59168b] text-[18px] top-[-1.18px]">CSDL Hộ tịch - Tháng 12/2024</p>
              </div>
            </div>
            <div className="absolute bg-[#f0fdf4] content-stretch flex flex-col gap-[3.991px] h-[105.767px] items-start left-0 pb-[0.909px] pt-[16.903px] px-[16.903px] rounded-[10px] top-[101.78px] w-[416.009px]" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
              <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
                <p className="flex-[1_0_0] font-normal leading-[20px] min-h-px min-w-px relative text-[#008236] text-sm whitespace-pre-wrap">Hệ thống cung cấp</p>
              </div>
              <div className="h-[27.983px] relative shrink-0 w-full" data-name="Container">
                <p className="absolute font-normal leading-[28px] left-0 text-[#0d542b] text-[18px] top-[-1.18px]">Hệ thống Hộ tịch điện tử</p>
              </div>
              <div className="content-stretch flex h-[15.994px] items-start relative shrink-0 w-full" data-name="Container">
                <p className="flex-[1_0_0] font-normal leading-[16px] min-h-px min-w-px relative text-[#00a63e] text-[12px] whitespace-pre-wrap">SYS_HOTICH</p>
              </div>
            </div>
            <div className="absolute bg-[#fff7ed] content-stretch flex flex-col gap-[3.991px] h-[105.767px] items-start left-[432px] pb-[0.909px] pt-[16.903px] px-[16.903px] rounded-[10px] top-[101.78px] w-[416.009px]" data-name="Container">
              <div aria-hidden="true" className="absolute border-[#ffd6a7] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[10px]" />
              <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Container">
                <p className="flex-[1_0_0] font-normal leading-[20px] min-h-px min-w-px relative text-[#ca3500] text-sm whitespace-pre-wrap">Loại dữ liệu</p>
              </div>
              <div className="h-[27.983px] relative shrink-0 w-full" data-name="Container">
                <p className="absolute font-normal leading-[28px] left-0 text-[#7e2a0c] text-[18px] top-[-1.18px]">Hộ tịch</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[11.989px] h-[217.727px] items-start relative shrink-0 w-full" data-name="Container">
            <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Heading 4">
              <p className="flex-[1_0_0] font-normal leading-[20px] min-h-px min-w-px relative text-[#0f172b] text-sm whitespace-pre-wrap">Thông tin đối soát</p>
            </div>
            <div className="bg-[#f8fafc] h-[185.739px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
              <div className="content-stretch flex flex-col gap-[11.989px] items-start pt-[15.994px] px-[15.994px] relative size-full">
                <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <TextText text="Số bản ghi:" additionalClassNames="w-[69.19px]" />
                  <TextText1 text="850,000" additionalClassNames="w-[50.014px]" />
                </div>
                <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <TextText text="Ngày nhận:" additionalClassNames="w-[70.384px]" />
                  <TextText1 text="2024-12-20 10:15:00" additionalClassNames="w-[126.761px]" />
                </div>
                <div className="content-stretch flex h-[20px] items-start justify-between relative shrink-0 w-full" data-name="Container">
                  <TextText text="Lần đối soát cuối:" additionalClassNames="w-[108.011px]" />
                  <TextText1 text="2024-12-20 10:30:00" additionalClassNames="w-[126.761px]" />
                </div>
                <Container additionalClassNames="h-[25.795px]">
                  <TextText text="Trạng thái:" additionalClassNames="w-[64.332px]" />
                  <div className="bg-[#dcfce7] h-[25.795px] relative rounded-[30504000px] shrink-0 w-[109.332px]" data-name="Text">
                    <div aria-hidden="true" className="absolute border-[#b9f8cf] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[30504000px]" />
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                      <div className="absolute left-[12.9px] size-[11.989px] top-[6.9px]" data-name="Icon">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.9886 11.9886">
                          <g clipPath="url(#clip0_922_88)" id="Icon">
                            <path d={svgPaths.p12862c0} id="Vector" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999053" />
                            <path d={svgPaths.p3dd14200} id="Vector_2" stroke="var(--stroke-0, #008236)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.999053" />
                          </g>
                          <defs>
                            <clipPath id="clip0_922_88">
                              <rect fill="white" height="11.9886" width="11.9886" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <p className="absolute font-normal leading-[16px] left-[28.88px] text-[#008236] text-[12px] top-[3.9px]">Khớp dữ liệu</p>
                    </div>
                  </div>
                </Container>
                <Container additionalClassNames="h-[20px]">
                  <TextText text="Tỷ lệ khớp:" additionalClassNames="w-[67.003px]" />
                  <div className="h-[20px] relative shrink-0 w-[187.884px]" data-name="Container">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
                      <div className="bg-[#e2e8f0] h-[7.997px] relative rounded-[30504000px] shrink-0 w-[127.997px]" data-name="Container">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
                          <div className="bg-[#00c950] h-[7.997px] rounded-[30504000px] shrink-0 w-full" data-name="Container" />
                        </div>
                      </div>
                      <div className="h-[20px] relative shrink-0 w-[51.889px]" data-name="Text">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                          <p className="absolute font-normal leading-[20px] left-0 text-[#0f172b] text-sm top-[-2px] w-[52px] whitespace-pre-wrap">100.00%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[72.884px] relative shrink-0 w-[895.994px]" data-name="Container">
        <div aria-hidden="true" className="absolute border-[#e2e8f0] border-solid border-t-[0.909px] inset-0 pointer-events-none" />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.989px] items-start justify-end pr-[23.991px] pt-[16.903px] relative size-full">
          <Wrapper1 additionalClassNames="bg-[#f1f5f9] w-[71.065px]">
            <p className="-translate-x-1/2 absolute font-normal leading-[24px] left-[36.49px] text-[#314158] text-[16px] text-center top-[5.91px]">Đóng</p>
          </Wrapper1>
          <Wrapper1 additionalClassNames="bg-[#155dfc] w-[148.636px]">
            <div className="absolute left-[15.99px] size-[15.994px] top-[11.99px]" data-name="Icon">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9943 15.9943">
                <g id="Icon">
                  <path d="M7.99716 9.99645V1.99929" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                  <path d={svgPaths.p14e7e398} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                  <path d={svgPaths.p24213270} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                </g>
              </svg>
            </div>
            <p className="-translate-x-1/2 absolute font-normal leading-[24px] left-[86.49px] text-[16px] text-center text-white top-[5.91px]">Xuất báo cáo</p>
          </Wrapper1>
        </div>
      </div>
    </div>
  );
}