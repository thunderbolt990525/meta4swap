import Hero from "../layout/Hero";
import Content from "../layout/Content";
// import FeaturedProduct from "../layout/FeaturedProduct";
import FeaturedService from "../layout/FeaturedService";
import LatestServices from "../layout/LatestServices";
import LatestTasks from "../layout/LatestTasks";

function Home() {
  return (
    <>
      <Hero />
      <LatestServices />
      <LatestTasks />
      <Content />
    </>
  );
}

export default Home;
