import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const MenuItem = ({ item, setNotification }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userAbility = Cookies.get('ability');
    const decodedAbility = userAbility ? decodeURIComponent(userAbility) : '';
    const userAbilitiesArray = decodedAbility.split(',');

    const hasAccess = (requiredAbilities) => {
        if (!requiredAbilities || requiredAbilities.length === 0) {
            return true;
        }
        return requiredAbilities.some(required => userAbilitiesArray.includes(required));
    };

    if (item.length === 1) {
        const singleItem = item[0];
        if (!singleItem.requiredAbilities || hasAccess(singleItem.requiredAbilities)) {
            return (
                <div
                    className="flex items-center pl-4 py-2 cursor-pointer hover:bg-slate-500"
                    onClick={() => {
                        if (singleItem.path) navigate(singleItem.path);
                    }}
                >
                    {singleItem.icon && <i className={`${singleItem.icon} text-2xl mr-3`}></i>}
                    {singleItem.path ? <Link to={singleItem.path} className="text-xl">{singleItem.label}</Link> : <span className="text-xl">{singleItem.label}</span>}
                </div>
            );
        }
    } else if (item.length === 3) {
        const [groupLabel, subItems, groupConfig] = item;
        const groupIcon = groupConfig?.icon;

        const accessibleSubItems = subItems.filter(subItem =>
            !subItem.requiredAbilities || hasAccess(subItem.requiredAbilities)
        );

        if (accessibleSubItems.length > 0) {
            return (
                <div>
                    <div
                        className="flex items-center pl-4 py-2 cursor-pointer hover:bg-slate-500"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {groupIcon && <i className={`${groupIcon} text-2xl mr-3`}></i>}
                        <span className="text-xl">{groupLabel}</span>
                        <i className={`bx bx-chevron-down text-xl ml-auto transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}></i>
                    </div>
                    {isDropdownOpen && (
                        <div className="pl-12">
                            {accessibleSubItems.map((subItem, index) => (
                                <div
                                    key={index}
                                    className="flex items-center pl-4 py-2 cursor-pointer hover:bg-slate-500"
                                    onClick={() => {
                                        if (subItem.path) navigate(subItem.path);
                                    }}
                                >
                                    {subItem.icon && <i className={`${subItem.icon} text-2xl mr-3`}></i>}
                                    <Link to={subItem.path} className="text-lg">{subItem.label}</Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    }
    return null;
};

const MenuComponent = ({ menuItems, setNotification }) => {
    return (
        <div className="flex flex-col gap-y-0.5 text-slate-100">
            {menuItems.map((item, index) => (
                <MenuItem key={index} item={item} setNotification={setNotification} />
            ))}
        </div>
    );
};

export default MenuComponent;