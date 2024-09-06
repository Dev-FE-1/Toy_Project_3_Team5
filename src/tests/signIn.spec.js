import { test, expect } from '@playwright/test';

const TEST_USER_ID = 'test1234';
const TEST_PASSWORD = 'test1234';

test.describe('로그인 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signin');
  });

  test('로그인 폼이 올바르게 렌더링되는지 테스트', async ({ page }) => {
    await expect(page.getByAltText('위플리 로고')).toBeVisible();
    await expect(page.getByPlaceholder('아이디')).toBeVisible();
    await expect(page.getByPlaceholder('비밀번호')).toBeVisible();
    await expect(
      page.getByRole('button', { name: '로그인', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /구글로 로그인/i })
    ).toBeVisible();
    await expect(page.getByText('계정이 없으신가요?')).toBeVisible();
    await expect(page.getByText('회원가입하기')).toBeVisible();
  });

  test('필드가 비어있을 때 로그인 버튼이 비활성화되는지 테스트', async ({
    page,
  }) => {
    const loginButton = page.getByRole('button', {
      name: '로그인',
      exact: true,
    });
    await expect(loginButton).toBeDisabled();
  });

  test('필드가 채워졌을 때 로그인 버튼이 활성화되는지 테스트', async ({
    page,
  }) => {
    await page.getByPlaceholder('아이디').fill(TEST_USER_ID);
    await page.getByPlaceholder('비밀번호').fill(TEST_PASSWORD);
    const loginButton = page.getByRole('button', {
      name: '로그인',
      exact: true,
    });
    await expect(loginButton).toBeEnabled();
  });

  test('잘못된 로그인 시도 시 에러 메시지가 표시되는지 테스트', async ({
    page,
  }) => {
    await page.getByPlaceholder('아이디').fill('invaliduser');
    await page.getByPlaceholder('비밀번호').fill('wrongpassword');
    await page.getByRole('button', { name: '로그인', exact: true }).click();
    await expect(
      page.getByText('아이디와 비밀번호를 확인해주세요')
    ).toBeVisible();
  });

  test('회원가입하기 링크 클릭 시 회원가입 페이지로 이동하는지 테스트', async ({
    page,
  }) => {
    await page.getByText('회원가입하기').click();
    await expect(page).toHaveURL(/.*\/signup/);
  });

  test('Google 로그인 버튼 클릭이 정상적으로 작동하는지 테스트', async ({
    page,
  }) => {
    const googleLoginButton = page.getByRole('button', {
      name: /구글로 로그인/i,
    });
    await googleLoginButton.click();
  });
});
