export const initTime = () => {
    const timeElement = document.getElementById('currentTime');

    const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    };

    // Update time immediately and then every minute
    updateTime();
    setInterval(updateTime, 60000);
};
