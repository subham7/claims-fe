const { default: Head } = require("next/head");

const CustomHead = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta content={description} name="description" />
      <meta
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        name="viewport"
      />
      <link href="https://app.stationx.network" rel="canonical" />
      <meta content="https://app.stationx.network" property="og:url" />
      <meta content={"StationX"} property="og:site_name" />
      <meta content={title} property="og:title" />
      <meta content={description} property="og:description" />
      <meta
        content={"https://app.stationx.network/assets/images/monogram.png"}
        property="og:image"
      />
      <meta content="summary_large_image" property="twitter:card" />
      <meta content={"StationX"} property="twitter:site" />
      <meta content={title} property="twitter:title" />
      <meta content={description} property="twitter:description" />
      <meta
        content={"https://app.stationx.network/assets/images/monogram.png"}
        property="twitter:image"
      />
      <meta content="400" property="twitter:image:width" />
      <meta content="400" property="twitter:image:height" />
      <meta content="appstationxnetwork" property="twitter:creator" />
      <link
        href="/opensearch.xml"
        rel="search"
        title={"StationX"}
        type="application/opensearchdescription+xml"
      />
      {/* Prefetch and Preconnect */}
      <link
        href="https://app.stationx.network/assets/images/monogram.png"
        rel="preconnect"
      />
      <link
        href="https://app.stationx.network/assets/images/monogram.png"
        rel="dns-prefetch"
      />
      {/* Icons */}
      <link
        href="https://app.stationx.network/assets/images/monogram.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="https://app.stationx.network/assets/images/monogram.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="https://app.stationx.network/assets/images/monogram.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
    </Head>
  );
};

export default CustomHead;
