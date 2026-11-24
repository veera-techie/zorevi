import FashionHubCard from './FashionHubCard';

export default function MallCard(props) {
  return <FashionHubCard hub={props.mall} {...props} />;
}
