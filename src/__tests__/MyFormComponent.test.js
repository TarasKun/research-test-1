import React from "react";
import { render, fireEvent, screen } from '@testing-library/react';
import MyFormComponent from '../components/MyFormComponent';

describe('testing MyFormComponent', () => {
    const logSpy = jest.spyOn(global.console, 'log');
    it('Case 1. The form with all fields filled in correctly', () => {
        render(<MyFormComponent />);

        const testingData = {
            name: 'TestName',
            email: 'testemail@example.com',
            agreeTerms: true,
            gender: 'male',
        };

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: testingData.name } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: testingData.email } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue(testingData.gender));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith(testingData);
    });
    it('Case 2. The form with a very long valid name', () => {
        render(<MyFormComponent />);
        const veryLongName = 'VeryVeryLongNameVeryVeryLongNameVeryVeryLongNameVeryVeryLongNameVeryVeryLongNameVeryVeryLongNameVeryVeryLongName'
        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: veryLongName } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testemail@example.com' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue('male'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: veryLongName,
            email: 'testemail@example.com',
            agreeTerms: true,
            gender: 'male',
        });
    });
    it('Case 3. The form with a complex email address that is valid ', () => {
        render(<MyFormComponent />);

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'testName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test.name+alias@example.co.uk' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue('male'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: 'testName',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'male',
        });
    });
    it('Case 4. The gender from male to female', () => {
        render(<MyFormComponent />);

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'testName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test.name+alias@example.co.uk' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue('female'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: 'testName',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'female',
        });
    });
    it('Case 5. Re-submit the form after an initial successful submission', () => {
        render(<MyFormComponent />);

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'testName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test.name+alias@example.co.uk' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue('male'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: 'testName',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'male',
        });
        fireEvent.click(screen.getByText('Submit'));
        expect(logSpy).toHaveBeenCalledWith({
            name: 'testName',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'male',
        });
    });
    it('Case 6. The form with the \'Name\' field left blank', () => {
        render(<MyFormComponent />);

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: '' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test.name+alias@example.co.uk' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue('male'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: '',
            email: 'test.name+alias@example.co.uk',
            agreeTerms: true,
            gender: 'male',
        });
    });
    it('Case 7. The form with an invalid email address', () => {
        render(<MyFormComponent />);
        const logsSpy = jest.spyOn(global.console, 'log');

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'testName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@email' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue('male'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        expect(logsSpy).toHaveBeenCalledWith({
            name: 'testName',
            email: 'invalid@email',
            agreeTerms: true,
            gender: 'male',
        });
    });
    it('Case 8. The form without checking the \'Agree to Terms\' checkbox', () => {
        render(<MyFormComponent />);

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testemail@example.com' } });
        fireEvent.click(screen.getByDisplayValue('male'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: 'TestName',
            email: 'testemail@example.com',
            agreeTerms: false,
            gender: 'male',
        });
    });
    it('Case 9. The form without selecting a gender.', () => {
        render(<MyFormComponent />);

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testemail@example.com' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: 'TestName',
            email: 'testemail@example.com',
            agreeTerms: true,
            gender: '',
        });
    });
    it('Case 10. The form with a name that is less than 3 characters long.', () => {
        render(<MyFormComponent />);

        // Fill in the fields of the form
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'S' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'testemail@example.com' } });
        fireEvent.click(screen.getByTestId('agreeTerms'));
        fireEvent.click(screen.getByDisplayValue('male'));

        // Send form
        fireEvent.click(screen.getByText('Submit'));

        // Check if the correct form data was sent
        expect(logSpy).toHaveBeenCalledWith({
            name: 'S',
            email: 'testemail@example.com',
            agreeTerms: true,
            gender: 'male',
        });
    });
});
