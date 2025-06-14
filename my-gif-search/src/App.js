import React, { useState } from 'react';
import './App.css';

// API ключ и лимит можно оставить здесь для наглядности
const API_KEY = 'oVksrQHmlOXmIXI4qBy6XHsUExbE8ci4';
const SEARCH_LIMIT = 24;

export default function App() {
    // Используем состояние (state) для хранения данных
    const [query, setQuery] = useState('');      // Текст из поля ввода
    const [gifs, setGifs] = useState([]);        // Массив с найденными гифками
    const [loading, setLoading] = useState(false); // Статус загрузки
    const [message, setMessage] = useState('Введите запрос, чтобы начать.'); // Сообщение для пользователя

    // --- ОСНОВНАЯ ФУНКЦИЯ ДЛЯ HTTP-ЗАПРОСА ---
    const searchGifs = async () => {
        // Если поле ввода пустое, ничего не делаем
        if (!query) {
            setMessage('Пожалуйста, введите что-нибудь для поиска.');
            return;
        }

        // Обновляем состояния перед началом запроса
        setLoading(true);     // Показываем, что идет загрузка
        setMessage('');       // Очищаем сообщение
        setGifs([]);          // Очищаем старые гифки

        // Формируем URL для запроса к API
        const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}&lang=ru`;

        try {
            // Выполняем HTTP GET-запрос с помощью fetch
            const response = await fetch(apiUrl);
            // Преобразуем ответ сервера в формат JSON
            const data = await response.json();

            // Проверяем, нашлись ли гифки
            if (data.data && data.data.length > 0) {
                setGifs(data.data); // Сохраняем гифки в состояние
            } else {
                setMessage(`По запросу "${query}" ничего не найдено.`);
            }
        } catch (error) {
            // Если произошла ошибка (например, нет интернета)
            console.error("Ошибка при запросе:", error);
            setMessage("Произошла ошибка при загрузке. Попробуйте снова.");
        } finally {
            // Этот блок выполнится в любом случае после try или catch
            setLoading(false); // Убираем статус загрузки
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Поиск GIF на React</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Введите слово или фразу, чтобы найти гифки.</p>
                </header>

                <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-4 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Например, 'радость'"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800"
                    />
                    <button
                        onClick={searchGifs}
                        disabled={loading}
                        className="w-full sm:w-auto bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Загрузка...' : 'Найти'}
                    </button>
                </div>

                <div className="text-center my-8 text-lg">
                    {message && <p className="text-gray-500">{message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gifs.map(gif => (
                        <div key={gif.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-200">
                            <img
                                src={gif.images.fixed_height.url}
                                alt={gif.title || 'GIF animation'}
                                className="w-full h-48 object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 