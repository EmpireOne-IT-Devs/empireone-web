
import Tabs from "@/app/_components/tabs";
export default function MyDocumentsLayout({children}) {
    const path = window.location.pathname.split('/')[4]
    const role = window.location.pathname.split('/')[2]
    const tabs = [
        {
            label: 'My Documents',
            path: `/accounts/${role}/my_documents`,
            active: path == undefined,
        },
        {
            label: 'Acknowledgements',
            path: `/accounts/${role}/my_documents/acknowledgements`,
            active: path == 'acknowledgements',
        },

    ];
    return (
        <>

            <Tabs tabs={tabs} />
            {children}
        </>
    );
}
