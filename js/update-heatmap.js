(() => {
  const initUpdateHeatmap = () => {
    const heatmap = document.querySelector('.mio-update-heatmap');
    if (!heatmap || heatmap.dataset.yearSelectReady === 'true') return;

    const select = heatmap.querySelector('#mio-heatmap-year');
    const panels = Array.from(
      heatmap.querySelectorAll('.mio-heatmap-year-panel')
    );

    if (!select || !panels.length) return;

    const showYear = () => {
      const selectedYear = select.value;

      panels.forEach(panel => {
        panel.hidden = panel.dataset.heatmapYear !== selectedYear;
      });
    };

    select.addEventListener('change', showYear);
    heatmap.dataset.yearSelectReady = 'true';
    showYear();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUpdateHeatmap, { once: true });
  } else {
    initUpdateHeatmap();
  }

  document.addEventListener('pjax:complete', initUpdateHeatmap);
})();
