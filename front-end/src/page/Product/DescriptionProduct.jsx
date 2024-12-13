import React from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
const cx = classNames.bind(styles);

function DisplayHTML({ content }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
}

export default function DescriptionProduct({ show, content }) {
  return (
    <div
      className={cx(
        `grid lg:grid-cols-1 gap-7 max-sm:grid-cols-1 ${
          show ? "block" : "hidden"
        }`
      )}
    >
      <div className={cx("p-3 text-start leading-loose text-[20px]")}>
        <DisplayHTML content={content} />
      </div>
    </div>
  );
}
