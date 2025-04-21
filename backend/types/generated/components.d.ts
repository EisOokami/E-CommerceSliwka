import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentsArray extends Struct.ComponentSchema {
  collectionName: 'components_components_arrays';
  info: {
    displayName: 'Array';
    icon: 'archive';
  };
  attributes: {
    item: Schema.Attribute.String;
  };
}

export interface ComponentsCategory extends Struct.ComponentSchema {
  collectionName: 'components_components_categories';
  info: {
    description: '';
    displayName: 'Category';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'Smartphones',
        'Smartwatches',
        'Cameras',
        'Headphones',
        'Computers',
        'Laptops',
        'Gaming',
        'Other',
      ]
    >;
  };
}

export interface ComponentsDetailedSpecifications
  extends Struct.ComponentSchema {
  collectionName: 'components_components_detailed_specifications';
  info: {
    displayName: 'Detailed Specifications';
  };
  attributes: {
    name: Schema.Attribute.String;
    specifications: Schema.Attribute.Component<
      'components.specification',
      true
    >;
  };
}

export interface ComponentsFeatureProduct extends Struct.ComponentSchema {
  collectionName: 'components_components_feature_products';
  info: {
    displayName: 'FeatureProduct';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'components.link', false>;
    subHeading: Schema.Attribute.Text;
  };
}

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ComponentsNavigation extends Struct.ComponentSchema {
  collectionName: 'components_components_navigations';
  info: {
    displayName: 'Navigation';
  };
  attributes: {
    s: Schema.Attribute.String;
  };
}

export interface ComponentsProductInfo extends Struct.ComponentSchema {
  collectionName: 'components_components_product_infos';
  info: {
    displayName: 'Product Info';
  };
  attributes: {
    delivery: Schema.Attribute.String;
    guaranteed: Schema.Attribute.String;
    inStore: Schema.Attribute.String;
  };
}

export interface ComponentsProductSpecifications
  extends Struct.ComponentSchema {
  collectionName: 'components_components_product_specifications';
  info: {
    displayName: 'Product Specifications';
  };
  attributes: {
    icon: Schema.Attribute.String;
    name: Schema.Attribute.String;
    specification: Schema.Attribute.String;
  };
}

export interface ComponentsReview extends Struct.ComponentSchema {
  collectionName: 'components_components_reviews';
  info: {
    description: '';
    displayName: 'Review';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    fullname: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true>;
    publicationDate: Schema.Attribute.Date;
    rating: Schema.Attribute.Integer;
  };
}

export interface ComponentsSpecification extends Struct.ComponentSchema {
  collectionName: 'components_components_specifications';
  info: {
    description: '';
    displayName: 'Specification';
  };
  attributes: {
    name: Schema.Attribute.String;
    specifications: Schema.Attribute.Component<'components.array', true>;
  };
}

export interface ComponentsUtilityLinks extends Struct.ComponentSchema {
  collectionName: 'components_components_utility_links';
  info: {
    displayName: 'Utility links';
  };
  attributes: {
    links: Schema.Attribute.Component<'components.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutDiscounts extends Struct.ComponentSchema {
  collectionName: 'components_layout_discounts';
  info: {
    description: '';
    displayName: 'Discounts Section';
  };
  attributes: {
    stores: Schema.Attribute.Relation<'oneToMany', 'api::store.store'>;
  };
}

export interface LayoutFeatureProductsSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_feature_products_sections';
  info: {
    description: '';
    displayName: 'FeatureProducts Section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    featureproduct: Schema.Attribute.Component<
      'components.feature-product',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    aboutUs: Schema.Attribute.Text;
    logoImage: Schema.Attribute.Media<'images'>;
    logoLink: Schema.Attribute.Component<'components.link', false>;
    socialLinks: Schema.Attribute.Component<'components.link', true>;
    utilityLinks: Schema.Attribute.Component<'components.utility-links', true>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    iconsLink: Schema.Attribute.Component<'components.link', true>;
    logoImage: Schema.Attribute.Media<'images'>;
    logoLink: Schema.Attribute.Component<'components.link', false>;
    navigationLinks: Schema.Attribute.Component<'components.link', true>;
  };
}

export interface LayoutHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_hero_sections';
  info: {
    description: '';
    displayName: 'Hero Section';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'components.link', false>;
    subHeading: Schema.Attribute.Text;
  };
}

export interface LayoutProductsCarouselSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_products_carousel_sections';
  info: {
    displayName: 'Products Carousel Section';
  };
  attributes: {
    stores: Schema.Attribute.Relation<'oneToMany', 'api::store.store'>;
  };
}

export interface LayoutProductsSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_products_sections';
  info: {
    description: '';
    displayName: 'Products Section';
  };
  attributes: {
    bestseller: Schema.Attribute.Relation<'oneToMany', 'api::store.store'>;
    categories: Schema.Attribute.Component<'components.category', true>;
    featuredProducts: Schema.Attribute.Relation<
      'oneToMany',
      'api::store.store'
    >;
    newArrival: Schema.Attribute.Relation<'oneToMany', 'api::store.store'>;
    tabs: Schema.Attribute.Component<'components.array', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'components.array': ComponentsArray;
      'components.category': ComponentsCategory;
      'components.detailed-specifications': ComponentsDetailedSpecifications;
      'components.feature-product': ComponentsFeatureProduct;
      'components.link': ComponentsLink;
      'components.navigation': ComponentsNavigation;
      'components.product-info': ComponentsProductInfo;
      'components.product-specifications': ComponentsProductSpecifications;
      'components.review': ComponentsReview;
      'components.specification': ComponentsSpecification;
      'components.utility-links': ComponentsUtilityLinks;
      'layout.discounts': LayoutDiscounts;
      'layout.feature-products-section': LayoutFeatureProductsSection;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.hero-section': LayoutHeroSection;
      'layout.products-carousel-section': LayoutProductsCarouselSection;
      'layout.products-section': LayoutProductsSection;
    }
  }
}
