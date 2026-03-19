"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Send,
    Wrench,
    Droplets,
    Zap,
    FlaskConical,
    HardHat,
    Gauge,
    Shield,
    Construction,
} from "lucide-react";

function useDebounce<T>(value: T, delay: number = 150): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

export interface ServiceAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    category?: string;
    shortcut?: string;
    type?: string;
}

const allServices: ServiceAction[] = [
    {
        id: "1",
        label: "Inspeção Técnica NR-13",
        icon: <Shield className="h-4 w-4 text-blue-500" />,
        category: "Inspeção",
        shortcut: "⌘1",
        type: "Serviço",
    },
    {
        id: "2",
        label: "Manutenção em Tanques",
        icon: <Droplets className="h-4 w-4 text-orange-500" />,
        category: "Manutenção",
        shortcut: "⌘2",
        type: "Serviço",
    },
    {
        id: "3",
        label: "Manutenção em Bombas",
        icon: <Gauge className="h-4 w-4 text-purple-500" />,
        category: "Manutenção",
        shortcut: "⌘3",
        type: "Serviço",
    },
    {
        id: "4",
        label: "Serviço Elétrico",
        icon: <Zap className="h-4 w-4 text-yellow-500" />,
        category: "Elétrica",
        shortcut: "⌘4",
        type: "Serviço",
    },
    {
        id: "5",
        label: "Controle de Qualidade",
        icon: <FlaskConical className="h-4 w-4 text-green-500" />,
        category: "Qualidade",
        shortcut: "⌘5",
        type: "Serviço",
    },
    {
        id: "6",
        label: "Manutenção em Dispensers",
        icon: <Wrench className="h-4 w-4 text-red-500" />,
        category: "Manutenção",
        shortcut: "⌘6",
        type: "Serviço",
    },
    {
        id: "7",
        label: "Manutenção em Automação",
        icon: <Construction className="h-4 w-4 text-indigo-500" />,
        category: "Automação",
        shortcut: "⌘7",
        type: "Serviço",
    },
    {
        id: "8",
        label: "Serviço Civil",
        icon: <HardHat className="h-4 w-4 text-gray-500" />,
        category: "Civil",
        shortcut: "⌘8",
        type: "Serviço",
    },
];

interface ServiceSearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    placeholder?: string;
    services?: ServiceAction[];
    onModeChange?: (mode: 'problem' | 'service') => void;
}

export function ServiceSearchBar({
    value,
    onChange,
    onSearch,
    onKeyPress,
    placeholder = "Ex: Inspeção técnica NR-13...",
    services = allServices,
    onModeChange,
}: ServiceSearchBarProps) {
    const [result, setResult] = useState<ServiceAction[] | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceAction | null>(null);
    const [searchMode, setSearchMode] = useState<'problem' | 'service'>('service');
    const debouncedQuery = useDebounce(value, 150);

    useEffect(() => {
        if (!isFocused) {
            setResult(null);
            return;
        }

        if (!debouncedQuery) {
            setResult(allServices);
            return;
        }

        const normalizedQuery = debouncedQuery.toLowerCase().trim();
        const filteredServices = allServices.filter((service) => {
            const searchableText = `${service.label} ${service.category}`.toLowerCase();
            return searchableText.includes(normalizedQuery);
        });

        setResult(filteredServices);
    }, [debouncedQuery, isFocused]);

    const container = {
        hidden: { opacity: 0, height: 0 },
        show: {
            opacity: 1,
            height: "auto",
            transition: {
                height: {
                    duration: 0.15,
                },
                opacity: {
                    duration: 0.1,
                },
                staggerChildren: 0.02,
            },
        },
        exit: {
            opacity: 0,
            height: 0,
            transition: {
                height: {
                    duration: 0.1,
                },
                opacity: {
                    duration: 0.1,
                },
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.15,
            },
        },
        exit: {
            opacity: 0,
            y: -5,
            transition: {
                duration: 0.1,
            },
        },
    };

    const handleFocus = () => {
        setSelectedService(null);
        setIsFocused(true);
    };

    const handleSelectService = (service: ServiceAction) => {
        setSelectedService(service);
        onChange(service.label);
        setIsFocused(false);
        // Executa a busca imediatamente
        requestAnimationFrame(() => {
            onSearch();
        });
    };

    const handleModeChange = (mode: 'problem' | 'service') => {
        setSearchMode(mode);
        if (onModeChange) {
            onModeChange(mode);
        }
    };

    return (
        <div className="w-full relative">
            {/* Seletor de modo - escondido quando o dropdown está aberto */}
            <AnimatePresence>
                {!isFocused && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full border border-purple/20 max-w-[500px] mx-auto"
                    >
                        <button
                            onClick={() => handleModeChange('problem')}
                            className={`flex-1 px-3 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all ${
                                searchMode === 'problem'
                                    ? 'bg-purple text-white shadow-lg shadow-purple/30'
                                    : 'text-gray-600 hover:text-purple'
                            }`}
                        >
                            <span className="hidden sm:inline">Descrever meu problema</span>
                            <span className="sm:hidden">Problema</span>
                        </button>
                        <button
                            onClick={() => handleModeChange('service')}
                            className={`flex-1 px-3 sm:px-5 py-2.5 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all ${
                                searchMode === 'service'
                                    ? 'bg-purple text-white shadow-lg shadow-purple/30'
                                    : 'text-gray-600 hover:text-purple'
                            }`}
                        >
                            <span className="hidden sm:inline">Cotar serviço</span>
                            <span className="sm:hidden">Serviço</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onKeyPress={onKeyPress}
                    className="w-full px-5 sm:px-7 py-4 sm:py-5 pr-14 sm:pr-16 bg-white border-[1.5px] border-gray-300 rounded-full text-[15px] sm:text-[17px] text-gray-900 outline-none transition-all focus:border-purple focus:shadow-[0_0_0_4px_rgba(98,57,150,0.15)] placeholder:text-gray-400"
                />
                <button
                    onClick={onSearch}
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={value.length === 0}
                    type="button"
                >
                    <AnimatePresence mode="popLayout">
                        {value.length > 0 ? (
                            <motion.div
                                key="send"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Send className="w-4 sm:w-5 h-4 sm:h-5 text-purple" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="search"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Search className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            <AnimatePresence>
                {isFocused && result && !selectedService && (
                    <motion.div
                        className="absolute w-full mt-2 border border-gray-200 rounded-2xl shadow-xl overflow-hidden bg-white z-50"
                        variants={container}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                    >
                        <motion.ul className="max-h-[280px] sm:max-h-[320px] overflow-y-auto">
                            {result.map((service) => (
                                <motion.li
                                    key={service.id}
                                    className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                                    variants={item}
                                    layout
                                    onClick={() => handleSelectService(service)}
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <span className="text-gray-600 flex-shrink-0">
                                            {service.icon}
                                        </span>
                                        <div className="flex flex-col items-start min-w-0">
                                            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate w-full">
                                                {service.label}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                                {service.category}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] sm:text-xs text-gray-400 text-right flex-shrink-0 ml-2">
                                        {service.type}
                                    </span>
                                </motion.li>
                            ))}
                        </motion.ul>
                        <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                                <span className="hidden sm:inline">↑↓ para navegar</span>
                                <span>Enter para selecionar</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
