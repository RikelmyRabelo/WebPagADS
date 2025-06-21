/**
 * MÓDULO DE NAVEGAÇÃO
 * Gerencia o scrollspy (borda nos links), o comportamento de esconder o header e o menu mobile.
 */
const Navigation = {
    init() {
        const header = document.querySelector('header');
        if (header) {
            this.setupScrollspy(header);
            this.setupHeaderScroll(header);
            this.setupMobileMenu(header);
        }
    },

    setupHeaderScroll(header) {
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const shouldHide = window.scrollY > lastScrollY && window.scrollY > header.offsetHeight;
            header.classList.toggle('header-hidden', shouldHide);
            lastScrollY = window.scrollY;
        });
    },

    setupMobileMenu(header) {
        const mobileMenuButton = header.querySelector('#mobile-menu-button');
        const mobileMenu = header.querySelector('#mobile-menu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
            });
        }
    },

    setupScrollspy(header) {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = header.querySelectorAll('nav a[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('nav-active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('nav-active');
                        }
                    });
                }
            });
        }, { rootMargin: '0px 0px -50% 0px' });

        sections.forEach(section => observer.observe(section));
    }
};


/**
 * MÓDULO DO PLANO DE AÇÃO
 * Carrega os dados de um JSON e gerencia a interatividade da seção.
 */
const ActionPlan = {
    actionPlanData: null,
    currentProposalKey: 'proposal1',
    currentTimelineKey: 'short',
    currentStatusFilter: 'all',
    
    // Classes de estilo para facilitar a manutenção
    inactiveTabClasses: ['text-gray-500', 'border-transparent', 'hover:text-gray-700', 'hover:border-gray-300'],
    activeTabClasses: ['text-teal-700', 'border-teal-700', 'font-semibold'],


    init(dataSource) {
        const actionPlanSection = document.getElementById('action-plan');
        if (!actionPlanSection) return;

        fetch(dataSource)
            .then(response => {
                if (!response.ok) throw new Error(`Erro na rede: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                this.actionPlanData = data;
                this.addEventListeners();
                this.renderProposalSection();
                this.selectInitialTab(); 
            })
            .catch(error => {
                console.error("Falha ao carregar dados do plano de ação:", error);
                const container = document.getElementById('timeline-content-container');
                if(container) container.innerHTML = "<p class='text-center text-red-500'>Erro ao carregar dados.</p>";
            });
    },

    addEventListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const clickedButton = e.currentTarget;
                
                tabButtons.forEach(btn => {
                    btn.classList.remove(...this.activeTabClasses);
                    btn.classList.add(...this.inactiveTabClasses);
                });

                clickedButton.classList.remove(...this.inactiveTabClasses);
                clickedButton.classList.add(...this.activeTabClasses);

                this.currentProposalKey = clickedButton.dataset.tab;
                this.renderProposalSection();
            });
        });
    },

    renderTimelineContent() {
        const proposal = this.actionPlanData[this.currentProposalKey];
        let timelineContent = proposal.timelines[this.currentTimelineKey].filter(action => this.currentStatusFilter === 'all' || action.status === this.currentStatusFilter);
        
        const contentContainer = document.getElementById('timeline-content');
        let actionsHTML = '<ul class="space-y-3 md:space-y-4">';

        if (timelineContent.length === 0) {
            actionsHTML += "<li class='text-center text-gray-500 py-8'>Nenhuma ação encontrada para este filtro.</li>";
        } else {
            timelineContent.forEach(action => {
                switch (action.status) {
                    case 'concluido':
                        const linkText = action.linkText || 'Ver projeto →'; // Usa o texto personalizado ou o padrão
                        actionsHTML += `<li><a href="${action.link}" target="_blank" rel="noopener noreferrer" class="block bg-green-50 p-4 md:p-5 rounded-lg border border-green-300 transform hover:-translate-y-1 transition-transform shadow-sm hover:shadow-lg"><div class="flex justify-between items-start"><h4 class="font-bold text-green-900 text-base md:text-lg pr-4">${action.title}</h4><div class="flex-shrink-0 flex items-center bg-green-200 text-green-900 text-xs font-bold px-2 py-1 rounded-full"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Concluído!</div></div><div class="text-green-800 text-sm md:text-base mt-2 space-y-1"><p><span class="font-semibold">Responsáveis:</span> ${action.responsaveis}</p><p><span class="font-semibold">Recursos:</span> ${action.recursos}</p></div><div class="text-right text-blue-600 font-semibold mt-2 text-sm">${linkText}</div></a></li>`;
                        break;
                    case 'em_processo': actionsHTML += `<li class="bg-yellow-50 p-4 md:p-5 rounded-lg border border-yellow-300 shadow-sm"><div class="flex justify-between items-start"><h4 class="font-bold text-yellow-900 text-base md:text-lg pr-4">${action.title}</h4><div class="flex-shrink-0 flex items-center bg-yellow-200 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full"><svg class="w-4 h-4 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Em processo</div></div><div class="text-yellow-800 text-sm md:text-base mt-2 space-y-1"><p><span class="font-semibold">Responsáveis:</span> ${action.responsaveis}</p><p><span class="font-semibold">Recursos:</span> ${action.recursos}</p></div></li>`; break;
                    default: actionsHTML += `<li class="bg-red-50 p-4 md:p-5 rounded-lg border border-red-200"><div class="flex justify-between items-start"><h4 class="font-bold text-red-900 text-base md:text-lg pr-4">${action.title}</h4><div class="flex-shrink-0 flex items-center bg-red-200 text-red-900 text-xs font-bold px-2 py-1 rounded-full"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Não iniciado</div></div><div class="text-red-800 text-sm md:text-base mt-2 space-y-1"><p><span class="font-semibold">Responsáveis:</span> ${action.responsaveis}</p><p><span class="font-semibold">Recursos:</span> ${action.recursos}</p></div></li>`; break;
                }
            });
        }
        actionsHTML += '</ul>';
        contentContainer.innerHTML = actionsHTML;

        const currentTimelineButton = document.querySelector(`.timeline-tab[data-timeline="${this.currentTimelineKey}"]`);
        if (currentTimelineButton) currentTimelineButton.classList.add('timeline-tab-active');
    },

    renderProposalSection() {
        const timelineControlsHTML = `<div class="flex justify-center mb-6 bg-gray-100 rounded-lg p-1 space-x-1"><button class="timeline-tab px-4 py-2 text-sm font-semibold rounded-md text-gray-600 flex-1 text-center" data-timeline="short">Curto Prazo</button><button class="timeline-tab px-4 py-2 text-sm font-semibold rounded-md text-gray-600 flex-1 text-center" data-timeline="medium">Médio Prazo</button><button class="timeline-tab px-4 py-2 text-sm font-semibold rounded-md text-gray-600 flex-1 text-center" data-timeline="long">Longo Prazo</button></div><div id="timeline-content"></div>`;
        const filterControlsHTML = `<div class="flex flex-wrap justify-center bg-gray-100 rounded-lg p-1 space-x-1" id="status-filter-buttons"><button class="filter-tab status-tab-active px-3 py-1 text-sm font-semibold rounded-md text-gray-800 flex-1 text-center" data-status="all">Todos</button><button class="filter-tab px-3 py-1 text-sm font-semibold rounded-md text-gray-600 flex-1 text-center" data-status="concluido">Concluído</button><button class="filter-tab px-3 py-1 text-sm font-semibold rounded-md text-gray-600 flex-1 text-center" data-status="em_processo">Em Processo</button><button class="filter-tab px-3 py-1 text-sm font-semibold rounded-md text-gray-600 flex-1 text-center" data-status="nao_iniciado">Não Iniciado</button></div>`;
        
        const proposalContent = document.getElementById('proposal-content');
        proposalContent.innerHTML = `<div class="w-full max-w-4xl mx-auto mb-4">${filterControlsHTML}</div><div id="timeline-content-container" class="w-full max-w-4xl mx-auto">${timelineControlsHTML}</div>`;
        
        const timelineContainer = document.getElementById('timeline-content-container');
        timelineContainer.addEventListener('click', (event) => {
            const timelineTab = event.target.closest('.timeline-tab');
            if (timelineTab) {
                this.currentTimelineKey = timelineTab.dataset.timeline;
                document.querySelectorAll('.timeline-tab').forEach(btn => btn.classList.remove('timeline-tab-active'));
                timelineTab.classList.add('timeline-tab-active');
                this.renderTimelineContent();
            }
        });
        
        proposalContent.addEventListener('click', (event) => {
            const filterTab = event.target.closest('.filter-tab');
            if(filterTab) {
                this.currentStatusFilter = filterTab.dataset.status;
                document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('status-tab-active'));
                filterTab.classList.add('status-tab-active');
                this.renderTimelineContent();
            }
        });

        this.renderTimelineContent();
    },

    selectInitialTab() {
        const initialTab = document.querySelector(`.tab-button[data-tab="${this.currentProposalKey}"]`);
        if (initialTab) {
            initialTab.classList.remove(...this.inactiveTabClasses);
            initialTab.classList.add(...this.activeTabClasses);
        }
    }
};


/**
 * MÓDULO PARA OUTRAS FUNCIONALIDADES (UI, Gráfico, Formulário)
 */
function initializeStaticModules() {
    // Animações
    const animatedSections = document.querySelectorAll('.fade-in-section');
    if (animatedSections.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedSections.forEach(section => observer.observe(section));
    }

    // Gráfico
    const chartElement = document.getElementById('diagnosisChart');
    if (chartElement) {
        new Chart(chartElement.getContext('2d'), {
            type: 'bar', data: { labels: ['Falta de Diálogo', 'Desrespeito e Bullying', 'Falta de Ações Contínuas', 'Direitos Negligenciados'], datasets: [{ label: 'Nível de Criticidade Percebido', data: [8, 9, 7, 8.5], backgroundColor: ['rgba(251, 191, 36, 0.6)', 'rgba(248, 113, 113, 0.6)', 'rgba(56, 189, 248, 0.6)', 'rgba(192, 132, 252, 0.6)'], borderColor: ['rgba(251, 191, 36, 1)', 'rgba(248, 113, 113, 1)', 'rgba(56, 189, 248, 1)', 'rgba(192, 132, 252, 1)'], borderWidth: 1 }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 10, title: { display: true, text: 'Nível de Criticidade (0-10)' } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => `${c.dataset.label || ''}: ${c.parsed.y}` } } } }
        });
    }
    
    // Formulário com AJAX para Netlify e fallback para HTML
    const contactForm = document.getElementById('contact-form-element');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o redirecionamento padrão

            const form = event.target;
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Feedback visual para o usuário
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            formFeedback.textContent = ''; // Limpa mensagens antigas

            fetch('/', {
                method: form.method,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                if (response.ok) {
                    // Sucesso no envio
                    form.reset(); // Limpa os campos do formulário
                    formFeedback.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
                    formFeedback.className = 'mt-4 text-center text-green-700'; // Estilo de sucesso
                } else {
                    // Erro retornado pelo servidor
                    throw new Error('Houve um problema com o envio. Tente novamente mais tarde.');
                }
            })
            .catch(error => {
                // Erro de rede ou o erro lançado acima
                formFeedback.textContent = 'Erro ao enviar a mensagem. Por favor, verifique sua conexão e tente novamente.';
                formFeedback.className = 'mt-4 text-center text-red-700'; // Estilo de erro
                console.error('Erro no envio do formulário:', error);
            })
            .finally(() => {
                // Reativa o botão em qualquer cenário
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
            });
        });
    }
}


// --- PONTO DE ENTRADA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();
    initializeStaticModules();
    ActionPlan.init('/data/action-plan.json');
});