import classNames from "classnames";
import styles from "./Cart.module.scss";

const cx = classNames.bind(styles);
export const Cart = () => {
  return (
    <div
      className={cx(
        "grid lg:grid-cols-12 lg:gap-x-[30px] max-sm:gap-y-[20px] "
      )}
    >
      <div className={cx("lg:col-span-8 ")}>
        <div className="flex bg-red-100">
          <img style={{ width: 175, height: 172 }} src="https://s3-alpha-sig.figma.com/img/0dc9/8023/1b3301cf80ceeab9071bd437ced0c257?Expires=1728864000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=I~jcd4t0EE23rSBlLXCW1tDzOF8l5E~ChHwVS103C6Sm0zAl5828VwZOiQt8nL3D7srt4wTFpKrhq5CWerVkPjC9uP-JFZ1LU-5wSQdewV4zL1QpWJBzMkCRQrF1ae7AtHvGNDrTVYSEMhyZV6FqIqDm~Kd5IwpLZGD3U-3ycoygemSoY2-5Pa2JefNEtAlhMM1DV9RzSFLlAYKM1UWMO91idp4kX3cl1oxyKkxHpQU3OFbP1HCWZbvT6JWs~jarV86P~CSoZByjH3LCsnvs9ovgG29iCyS1NqFM7RCMGSwGh38hMWLc~sebuP5tVNJSFAFPSBOm7j6hjwZIHJlGag__" />
          <div style={{ width: 654, height: 52, justifyContent: 'space-between', alignItems: 'flex-start', display: 'inline-flex' }}>
            <div style={{ width: 374, color: '#1A162E', fontSize: 18, fontFamily: 'Gordita', fontWeight: '500', lineHeight: 26, wordWrap: 'break-word' }}>Coffee Beans - Espresso Arabica and Robusta Beans</div>
            <div style={{ textAlign: 'right', color: '#1A162E', fontSize: 22, fontFamily: 'Gordita', fontWeight: '700', lineHeight: 32, wordWrap: 'break-word' }}>$47.00</div>
          </div>
        </div>

      </div>
      <div className={cx("lg:col-span-4")}>checkout</div>
    </div>
  );
};
