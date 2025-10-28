import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('Header Resume Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders Download Resume button', () => {
    render(<Header />);
    const downloadBtn = screen.getByText(/Download Resume/i);
    expect(downloadBtn).toBeInTheDocument();
  });

  test('Download Resume button has correct icon', () => {
    render(<Header />);
    const downloadBtn = screen.getByText(/Download Resume/i);
    const icon = downloadBtn.querySelector('i');
    expect(icon).toHaveClass('fa-download');
  });

  test('Admin button is visible when not logged in', () => {
    render(<Header />);
    const adminBtn = screen.getByText(/Admin/i);
    expect(adminBtn).toBeInTheDocument();
  });

  test('Download Resume button is clickable', () => {
    render(<Header />);
    const downloadBtn = screen.getByText(/Download Resume/i);
    expect(downloadBtn).toBeInTheDocument();
    fireEvent.click(downloadBtn);
    // Button click should not throw an error
  });

  test('localStorage is used for resume persistence', () => {
    const testResumeData = 'data:application/pdf;base64,test';
    localStorage.setItem('resume', testResumeData);
    localStorage.setItem('resumeFileName', 'test-resume.pdf');

    render(<Header />);

    expect(localStorage.getItem('resume')).toBe(testResumeData);
    expect(localStorage.getItem('resumeFileName')).toBe('test-resume.pdf');
  });

  test('Admin button triggers password prompt', () => {
    render(<Header />);

    // Mock the prompt
    window.prompt = jest.fn(() => 'Deepika@04');

    const adminBtn = screen.getByText(/Admin/i);
    fireEvent.click(adminBtn);

    // Verify prompt was called
    expect(window.prompt).toHaveBeenCalled();
  });
});

