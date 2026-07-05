# Responsive status

desktop: 1024x625 viewport - LISTO

sidebar hamburger threshold: < 1025px (lg breakpoint) - LISTO
- Layout, Sidebar, Topbar: down('lg') para hamburger en <= 1024px
- Theme: lg: 1025 (para que down('lg') cubra <= 1024px)

tablet: 600-899px - LISTO (Nexus 7, Galaxy Tab S4, iPad, Kindle Fire HDX)
- Sidebar: hamburger (temporary drawer) via lg breakpoint (1024px)
- Dashboard: grid 2 col × 4 row con cards span 1, row heights aumentadas
- DataGrids: scroll horizontal nativo, todas las columnas visibles
- Page titles: responsive typography (1.6rem - 2.5rem)
- Componentes: AddBtn, SearchBox, Topbar con valores sm/md
- Calendar: layout row en tablets
- Tasker: gap y height ajustados, stats bar responsive, DraggableTask/ArchivedTask con sm/md, touch-friendly action buttons

small-desktop: 1024-1199px - LISTO
- Sidebar: hamburger (temporary drawer) via lg breakpoint
- Dashboard: grid 2 col × 4 row con cards span 1
- Font sizes: tablet 600-899px (2.1rem page-title, 19px card-title, 15px task/event)
- Font sizes: small-desktop 1024-1199px (2.4rem page-title, 21px card-title, 16px task/event)
- Chart sizes ajustados

mobile: 320-428px - LISTO (iPhone 4, Galaxy S5, iPhone 12 Pro, Pixel 2, Samsung A22, etc.)
- Layout: TOPBAR_HEIGHT 52px en xs (64px sm+), px 12px en xs
- Sidebar: temporary drawer (hamburger) via lg breakpoint
- Page titles: xs: 1.4rem (1.6rem Dashboard)
- AddBtn: xs values (borderRadius 6px, py 0.3rem, px 0.7rem, fontSize 11px)
- DraggableTask/DraggableEvent: xs padding (1/1/1.8), gap 0.4, fonts (13px/10px), priority bar 14px
- ArchivedTask: xs padding (0.8/1.2/0.8), fonts (11px/10px)
- EventContainer: xs title font 11px, Paper padding 1/1/0.8, gap 0.8
- TaskContainer: xs gap 0.8
- Tasker/Calendar: header flexWrap, stats bar xs fonts (18px/9px)
- Calendar: height xs 55vh, archived section mt 6, p 1
- DynamicForm: xs gap 2, title fontSize 18
- DynamicComposedChart: legend gap 20px, fontSize 12px, top 20px
- MostSoldBarChart: YAxis width 80 en xs
- SearchBox: width 65vw en xs
- NotFound: 404 fontSize 60px, text 16px
- DataGrids: Clients oculta Address/Phone en xs, Products oculta Category/Price en xs
- UserProfile: Paper padding xs 2
- Chart pages: mb xs 2
- index.css: media query mobile para tasker-grid, dash-stat-row, dash-revenue-stat-row, dash-event-item

