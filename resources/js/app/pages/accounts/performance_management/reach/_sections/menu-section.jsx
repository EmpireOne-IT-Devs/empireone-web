import Menu from '@/app/_components/menu';
import {  FcFolder } from 'react-icons/fc';
import ShowReachSection from './show-reach-section';

export default function MenuSection({ props_data }) {

    const menuOptions = [
        {
            // Case 1: Passing a custom JSX component directly
            component: (
                <ShowReachSection props_data={props_data} />
            )
        },
        {
            // Case 2: Standard menu item with onClick handler
            label: 'View Projects',
            icon: FcFolder,
            onClick: () => alert('Clicked projects')
        }
    ];

    return <Menu items={menuOptions} />;
}