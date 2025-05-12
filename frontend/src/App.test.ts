import { expect, test, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import App from './App.svelte';
import './app.css';

// This mocks fetch globally sinc
global.fetch = vi.fn();

const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;

// Helper function to set viewport size
function setViewport(width: number, height: number) {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width
    });
    Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: height
    });
    window.dispatchEvent(new Event('resize'));
}

function mockArticlesResponse() {
    return {
        response: {
            docs: [
                {
                    headline: { main: 'Test Article 1' },
                    abstract: 'Test abstract 1',
                    multimedia: {
                        default: {
                            url: 'http://test1.com/image.jpg'
                        }
                    }
                },
                {
                    headline: { main: 'Test Article 2' },
                    abstract: 'Test abstract 2',
                    multimedia: {
                        default: {
                            url: 'http://test2.com/image.jpg'
                        }
                    }
                },
                {
                    headline: { main: 'Test Article 3' },
                    abstract: 'Test abstract 3',
                    multimedia: {
                        default: {
                            url: 'http://test3.com/image.jpg'
                        }
                    }
                },
                {
                    headline: { main: 'Test Article 4' },
                    abstract: 'Test abstract 4',
                    multimedia: {
                        default: {
                            url: 'http://test4.com/image.jpg'
                        }
                    }
                },
                {
                    headline: { main: 'Test Article 5' },
                    abstract: 'Test abstract 5',
                    multimedia: {
                        default: {
                            url: 'http://test5.com/image.jpg'
                        }
                    }
                },
                {
                    headline: { main: 'Test Article 6' },
                    abstract: 'Test abstract 6',
                    multimedia: {
                        default: {
                            url: 'http://test6.com/image.jpg'
                        }
                    }
                }
            ]
        }
    };
}

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    setViewport(originalInnerWidth, originalInnerHeight);
});

test('App', async () => {
    render(App);
});

test('Check Current Date', async () => {
    render(App);
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const expectedDate = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const dateElement = screen.getByText(expectedDate);
    expect(dateElement).toBeTruthy();
});

test('Should show loading state initially', async () => {
    vi.spyOn(global, 'fetch').mockImplementation(() => new Promise(() => {}));
    render(App);
    const loadingElement = screen.getByText('Loading articles...');
    expect(loadingElement).toBeTruthy();
});

test('Should display articles when API call succeeds', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockArticlesResponse()
    } as Response);

    render(App);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const article1 = screen.getByText('Test Article 1');
    const article2 = screen.getByText('Test Article 2');
    expect(article1).toBeTruthy();
    expect(article2).toBeTruthy();
});


test('Should display articles in 3 columns on desktop (>1024px)', async () => {
    setViewport(1200, 800);
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockArticlesResponse()
    } as Response);

    render(App);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const articles = screen.getAllByText(/Test Article/);
    expect(articles.length).toBe(6);
    
    const gridContainer = screen.getByTestId('grid-container');
    const containerRect = gridContainer.getBoundingClientRect();
    const firstArticleRect = articles[0].getBoundingClientRect();
    const secondArticleRect = articles[1].getBoundingClientRect();
    const thirdArticleRect = articles[2].getBoundingClientRect();
    
    // First three articles should be in the same row
    expect(firstArticleRect.top).toBe(secondArticleRect.top);
    expect(secondArticleRect.top).toBe(thirdArticleRect.top);
});

test('Should display articles in 2 columns on tablet (≤1024px)', async () => {
    setViewport(900, 800); 
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockArticlesResponse()
    } as Response);

    render(App);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const articles = screen.getAllByText(/Test Article/);
    expect(articles.length).toBe(6);
    

    const firstArticleRect = articles[0].getBoundingClientRect();
    const secondArticleRect = articles[1].getBoundingClientRect();
    
    expect(firstArticleRect.top).toBe(secondArticleRect.top);
    

    const gridContainer = screen.getByTestId('grid-container');
    const containerWidth = gridContainer.getBoundingClientRect().width;
    expect(firstArticleRect.width).toBeCloseTo(containerWidth / 2, 1);
    expect(secondArticleRect.width).toBeCloseTo(containerWidth / 2, 1);
});

test('Should display articles in 1 column on mobile (≤768px)', async () => {
    // here we are checking that the they are stacked and take up the full width of the screen
    setViewport(768, 1024);
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => mockArticlesResponse()
    } as Response);

    render(App);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const articles = screen.getAllByText(/Test Article/);
    expect(articles.length).toBe(6);
    
    const gridContainer = screen.getByTestId('grid-container');
    const containerWidth = gridContainer.getBoundingClientRect().width;
    

    const firstArticle = articles[0];
    const firstArticleWidth = firstArticle.getBoundingClientRect().width;
    expect(firstArticleWidth).toBe(containerWidth);
    
    const firstArticleBottom = firstArticle.getBoundingClientRect().bottom;
    const secondArticleTop = articles[1].getBoundingClientRect().top;
    expect(secondArticleTop).toBeGreaterThanOrEqual(firstArticleBottom);
});

test('Should display article content correctly', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({
            response: {
                docs: [
                    {
                        headline: { main: 'Test Article 1' },
                        abstract: 'This is a test abstract for article 1',
                        multimedia: {
                            default: {
                                url: 'http://test1.com/image.jpg'
                            }
                        }
                    }
                ]
            }
        })
    } as Response);

    render(App);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check headline
    const headline = screen.getByText('Test Article 1');
    expect(headline).toBeTruthy();
    
    // Check abstract
    const abstract = screen.getByText('This is a test abstract for article 1');
    expect(abstract).toBeTruthy();
    
    // Check image
    const image = screen.getByAltText('article1');
    expect(image).toBeTruthy();
    expect(image.getAttribute('src')).toBe('http://test1.com/image.jpg');
    
    // Check read time
    const readTime = screen.getByText('6 min read');
    expect(readTime).toBeTruthy();
});

test('Should fetch API key from Flask server', async () => {
    const mockApiKey = 'test-api-key-123';
    
    // Mock the fetch call to the Flask server
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
        if (url === 'http://localhost:8000/api/key') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ apiKey: mockApiKey })
            } as Response);
        }
        return Promise.reject(new Error('Unexpected URL'));
    });


    const response = await fetch('http://localhost:8000/api/key');
    const data = await response.json();

    // Verify the response
    expect(response.ok).toBe(true);
    expect(data).toHaveProperty('apiKey');
    expect(data.apiKey).toBe(mockApiKey);
});

test('Should fetch Davis and Sacramento Related Articles', async () => {
    const mockApiKey = 'test-api-key-123';
    
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
        if (url === 'http://localhost:8000/api/key') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ apiKey: mockApiKey })
            } as Response);
        }
        if (url === 'http://localhost:8000/getArticles') {
            // Mock the Flask server's response
            return Promise.resolve({
                ok: true,
                json: async () => ({
                    response: {
                        docs: [
                            {
                                headline: { main: 'Sacramento News: Local Development' },
                                abstract: 'New developments in Sacramento are changing the city landscape...',
                                multimedia: {
                                    default: {
                                        url: 'http://test1.com/image.jpg'
                                    }
                                }
                            },
                            {
                                headline: { main: 'UC Davis Research Breakthrough' },
                                abstract: 'Researchers at UC Davis have made a significant discovery...',
                                multimedia: {
                                    default: {
                                        url: 'http://test2.com/image.jpg'
                                    }
                                }
                            },
                            {
                                headline: { main: 'Sacramento and Davis Regional News' },
                                abstract: 'Joint initiatives between Sacramento and Davis are underway...',
                                multimedia: {
                                    default: {
                                        url: 'http://test3.com/image.jpg'
                                    }
                                }
                            }
                        ]
                    }
                })
            } as Response);
        }
        return Promise.reject(new Error('Unexpected URL'));
    });

    render(App);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify that the articles displayed are about Sacramento or Davis
    const articles = screen.getAllByText(/Sacramento|Davis|UC Davis/i);
    expect(articles.length).toBeGreaterThan(0);
    
    // Verify that at least one article mentions Sacramento
    const sacramentoArticles = screen.getAllByText(/Sacramento/i);
    expect(sacramentoArticles.length).toBeGreaterThan(0);
    
    // Verify that at least one article mentions Davis
    const davisArticles = screen.getAllByText(/Davis/i);
    expect(davisArticles.length).toBeGreaterThan(0);
    
    const response = await fetch('http://localhost:8000/getArticles');
    const data = await response.json();
    expect(data).toHaveProperty('response');
    expect(data.response).toHaveProperty('docs');
    expect(Array.isArray(data.response.docs)).toBe(true);
});