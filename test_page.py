from playwright.sync_api import sync_playwright
import time

def test_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 记录控制台日志
        page.on("console", lambda msg: print(f"Console [{msg.type}]: {msg.text}"))
        
        # 记录未捕获的异常
        page.on("pageerror", lambda exc: print(f"Uncaught exception: {exc}"))
        
        # 记录网络请求失败
        page.on("requestfailed", lambda req: print(f"Request failed: {req.url} - {req.failure}"))
        
        # 记录网络响应状态码
        page.on("response", lambda res: print(f"Response: {res.url} - {res.status}") if res.status >= 400 else None)
        
        print("Navigating to URL...")
        page.goto('https://snapknow-d2gvwpr5u6e0f8de0-1332603592.tcloudbaseapp.com/snapknow/')
        
        # 等待页面加载
        try:
            page.wait_for_load_state('networkidle', timeout=10000)
        except Exception as e:
            print(f"Wait for networkidle timed out: {e}")
            
        # 截图保存当前状态
        page.screenshot(path='/Users/yinfengkeji/Desktop/my-projects/SnapKnow/debug_screenshot.png', full_page=True)
        
        # 获取当前页面的 DOM 结构看看渲染了什么
        print("\n--- DOM Body Content ---")
        body_content = page.locator('body').inner_html()
        print(body_content[:500] + "..." if len(body_content) > 500 else body_content)
        
        browser.close()

if __name__ == "__main__":
    test_page()