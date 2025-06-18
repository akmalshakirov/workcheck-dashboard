import {
    TbLayoutSidebarLeftCollapse,
    TbLayoutSidebarRightCollapse,
} from "react-icons/tb";

export const Header = ({ collapsed, setCollapsed }) => {
    return (
        <div className='p-2.5 flex-1 flex items-center justify-between max-h-max bg-white rounded-lg !w-full'>
            <div className='flex gap-2.5'>
                <button
                    onClick={() => {
                        setCollapsed(!collapsed);
                    }}
                    className='p-1 hover:bg-gray-700/30 duration-50'
                    title={collapsed ? "Menyuni ochish" : "Menyuni yopish"}
                    aria-label={
                        collapsed ? "Menyuni ochish" : "Menyuni yopish"
                    }>
                    {collapsed ? (
                        <TbLayoutSidebarLeftCollapse size={22} />
                    ) : (
                        <TbLayoutSidebarRightCollapse size={22} />
                    )}
                </button>
                <div>
                    <input
                        type='text'
                        className='px-2 py-1 border border-gray-700 rounded-lg outline-none focus:bg-gray-800/10 transition-colors'
                        placeholder='Qidirish...'
                    />
                </div>
            </div>
            <div className='flex'>
                <div>LANGUAGE</div>
                <div>FULL SCREEN</div>
                <div>NOTIFICATION</div>
                <div>NIGHT/DARK MODE</div>
                <div>PROFILE</div>
            </div>
        </div>
    );
};
