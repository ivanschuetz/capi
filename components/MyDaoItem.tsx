import Link from "next/link"
import { MyDaoJs } from "wasm/wasm"
import plus from "../images/svg/plus.svg"

export const MyDaoItem = ({ dao }: { dao: MyDaoJs }) => {
  return (
    // the dao url is unique
    <ItemContainer key={dao.url_rel}>
      <DaoLink url={dao.url_rel} text={dao.name} />
      <div className="h-44 w-full overflow-hidden bg-cover bg-center">
        <Link href={dao.url_rel}>
          <img className="h-full w-full" src={dao.image_url} alt=""></img>
        </Link>
      </div>
      {/* for now not don't involvement role - there's no design and not sure it's really needed */}
      {/* {involvementIcons(dao)} */}
    </ItemContainer>
  )
}

export const MyDaoCreateItem = () => {
  return (
    <ItemContainer key="create_item_key___">
      <DaoLink url="/" text="Create project" />
      <div className="flex h-44 items-center justify-center border-2 border-dashed border-te">
        <Link href={"/"} className="text-center">
          <img className="cursor-pointer" src={plus.src} alt="icon" />
        </Link>
      </div>
    </ItemContainer>
  )
}

const DaoLink = ({ text, url }: { text: string; url: string }) => {
  return (
    <Link href={url} className="mx-5 text-60 font-bold text-te">
      {text}
    </Link>
  )
}

const ItemContainer = ({ key, children }: { key: string; children: any }) => {
  return (
    <div
      key={key}
      className="flex w-full flex-col-reverse gap-5 text-60 font-bold md:w-[calc((100%-40px)/2)]"
    >
      {children}
    </div>
  )
}

// const involvementIcons = (dao) => {
//   let icons = [];
//   if (dao.created_by_me === "true") {
//     icons.push(involvementIcon("todo", ""));
//   }
//   if (dao.invested_by_me === "true") {
//     icons.push(involvementIcon("todo", ""));
//   }
//   return icons;
// };

// const involvementIcon = (src, alt) => {
//   return (
//     <img
//       className="my_dao__involvement_icon img-placeholder"
//       src={src}
//       alt={alt}
//     />
//   );
// };
