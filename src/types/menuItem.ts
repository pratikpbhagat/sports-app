export type MenuItem = {
    title: string;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    url: string;
    component: React.ComponentType;
    children?: MenuItem[];
};