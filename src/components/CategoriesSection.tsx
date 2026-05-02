import CategoryItem from "./CategoryItem";

const CategoriesSection = () => {
  return (
    <div className="max-w-screen-2xl px-20 mx-auto mt-24">
      <h2 className="text-black text-5xl font-normal tracking-[1.56px] max-sm:text-4xl mb-12">
        Our Categories
      </h2>
      <div className="grid grid-cols-2 gap-10">
        <CategoryItem
          categoryTitle="Pajamas"
          image="3176278b00fe8d9becb68414060387d8.jpg"
          link="pajamas"
        />
        <CategoryItem
          categoryTitle="Lingerie"
          image="S3f53e94f4a054ed3a9e6fd81eaa72d36U_1300x.webp"
          link="lingerie"
        />
        <CategoryItem
          categoryTitle="Winter"
          image="c2351b9581ed0a187081b08bb02c248b.jpg"
          link="winter"
        />
        <CategoryItem
          categoryTitle="Summer"
          image="feafc451fb97c4ce0a5304af58c887ae.jpg"
          link="summer"
        />
      </div>
    </div>
  );
};
export default CategoriesSection;
