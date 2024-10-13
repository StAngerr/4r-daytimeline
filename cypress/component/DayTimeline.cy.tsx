/// <reference types="cypress" />

import { DayTimeline } from '../../src/DayTimeline/DayTimeline';
import '../../src/index.css';
import '../../src/App.css';
import '../../src/DayTimeline/DayTimeline.css';

const noop = () => void 0;
const timeslotDefaultHeight = 60;

describe('DayTimeline.cy.tsx', () => {
    describe('should properly init', () => {
        it('should render proper amount of items', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline onChange={noop} />
                </div>,
            );
            const allItems = cy.get('.timeline-item');
            allItems.should('have.length', 24 * 2);
        });

        it('should should properly show labels', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline onChange={noop} />
                </div>,
            );
            cy.get('.timeline-item')
                .eq(10 * 2)
                .within(() =>
                    cy.get('.time-label').should('have.text', '10:00'),
                );

            cy.get('.timeline-item')
                .eq(0)
                .within(() =>
                    cy.get('.time-label').should('have.text', '00:00'),
                );

            cy.get('.timeline-item')
                .last()
                .within(() =>
                    cy.get('.time-label').should('have.text', '23:30'),
                );
        });

        it('should not show current time by default', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline onChange={noop} />
                </div>,
            );

            cy.get('.current-time').should('not.exist');
        });
    });

    describe('defaultSelected', () => {
        it('should properly display default selected as date object', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        defaultSelected={{
                            start: new Date('2024-08-09T05:30:00+02:00'),
                            end: new Date('2024-08-09T07:00:00+02:00'),
                        }}
                        onChange={noop}
                    />
                </div>,
            );

            const timeslotDefaultHeight = 60;
            const startHour = 5.5;
            const interval = 2;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'top')
                .then((topValue) => {
                    expect(topValue).to.be.eq(
                        `${startHour * interval * timeslotDefaultHeight}px`,
                    );
                });

            const endHour = 7;
            const hourDiff = 24 - endHour;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'bottom')
                .then((bottomValue) => {
                    expect(bottomValue).to.be.eq(
                        `${hourDiff * interval * timeslotDefaultHeight}px`,
                    );
                });
        });

        it('should properly render default selected for 1 hour interval', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        interval={60}
                        defaultSelected={{
                            start: new Date('2024-08-09T14:30:00+02:00'),
                            end: new Date('2024-08-09T17:00:00+02:00'),
                        }}
                        onChange={noop}
                    />
                </div>,
            );

            const timeslotDefaultHeight = 60;
            const startHour = 14.5;
            const interval = 1;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'top')
                .then((topValue) => {
                    expect(topValue).to.be.eq(
                        `${startHour * interval * timeslotDefaultHeight}px`,
                    );
                });

            const endHour = 17;
            const hourDiff = 24 - endHour;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'bottom')
                .then((bottomValue) => {
                    expect(bottomValue).to.be.eq(
                        `${hourDiff * interval * timeslotDefaultHeight}px`,
                    );
                });
        });

        it('should properly display default selected as date numeric values', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        defaultSelected={[22.16666, 23.25]}
                        onChange={noop}
                    />
                </div>,
            );

            const timeslotDefaultHeight = 60;
            const startHour = 22.16666;
            const interval = 2;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'top')
                .then((topValue) => {
                    expect(topValue).to.be.eq(
                        `${Math.round(startHour * interval * timeslotDefaultHeight)}px`,
                    );
                });

            const endHour = 23.25;
            const hourDiff = 24 - endHour;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'bottom')
                .then((bottomValue) => {
                    expect(bottomValue).to.be.eq(
                        `${Math.round(hourDiff * interval * timeslotDefaultHeight)}px`,
                    );
                });
        });

        it('should properly display default selected as string periods', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        defaultSelected={['03:10', '23:22']}
                        onChange={noop}
                    />
                </div>,
            );

            const timeslotDefaultHeight = 60;
            const startHour = 3.16666;
            const interval = 2;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'top')
                .then((topValue) => {
                    expect(topValue).to.be.eq(
                        `${Math.round(startHour * interval * timeslotDefaultHeight)}px`,
                    );
                });

            const endHour = 23.36666666666666664;
            const hourDiff = 24 - endHour;

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'bottom')
                .then((bottomValue) => {
                    expect(bottomValue).to.be.eq(
                        `${Math.round(hourDiff * interval * timeslotDefaultHeight)}px`,
                    );
                });
        });
    });

    describe('drag period', () => {
        it('should properly display drug elements', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline defaultSelected={[10, 11]} onChange={noop} />
                </div>,
            );
            cy.get('.resize-top').should('exist');
            cy.get('.resize-bottom').should('exist');
        });

        it('should properly drag upper part to top', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline defaultSelected={[10, 11]} onChange={noop} />
                </div>,
            );
            cy.get('.resize-top').trigger('mousedown');

            const timeslotDefaultHeight = 60;
            const startHour = 8.5;
            const interval = 2;
            cy.get('body').trigger('mousemove', {
                clientY: -60,
            });
            cy.get('body').trigger('mousemove', {
                clientY: -60,
            });
            cy.get('body').trigger('mousemove', {
                clientY: -60,
            });
            cy.get('body').trigger('mouseup');
            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'top')
                .then((topValue) => {
                    expect(topValue).to.be.eq(
                        `${startHour * interval * timeslotDefaultHeight}px`,
                    );
                });
        });

        it('should properly drag upper part to bottom', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline defaultSelected={[10, 11]} onChange={noop} />
                </div>,
            );
            cy.get('.resize-top').scrollIntoView().trigger('mousedown');

            const timeslotDefaultHeight = 60;
            const startHour = 10.5;
            const interval = 2;
            cy.get('.day-timeline-period.new-period')
                .scrollIntoView()
                .trigger('mousemove', {
                    clientY: window.scrollY + timeslotDefaultHeight + 5,
                });

            cy.wait(10)
                .then(() => {
                    cy.get('body').trigger('mouseup');
                })
                .then(() => {
                    cy.get('.day-timeline-period.new-period')
                        .should('have.css', 'top')
                        .then((topValue) => {
                            expect(topValue).to.be.eq(
                                `${startHour * interval * timeslotDefaultHeight}px`,
                            );
                        });
                });
        });

        it('should properly drag lower part to bottom', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline defaultSelected={[1, 2]} onChange={noop} />
                </div>,
            );
            cy.get('.resize-bottom').trigger('mousedown');

            const timeslotDefaultHeight = 60;
            const endHour = 2.5;
            const interval = 2;
            cy.get('.day-timeline-period.new-period')
                .scrollIntoView()
                .then((el) => {
                    const rect = el[0].getBoundingClientRect();

                    return rect.top + rect.height;
                })
                .then((top) => {
                    cy.get('.day-timeline-period.new-period')
                        .scrollIntoView()
                        .trigger('mousemove', {
                            clientY: top + timeslotDefaultHeight + 1,
                        });
                });

            cy.get('body').trigger('mouseup');
            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'bottom')
                .then((bottomValue) => {
                    expect(bottomValue).to.be.eq(
                        `${(24 - endHour) * interval * timeslotDefaultHeight}px`,
                    );
                });
        });

        it('should properly drag lower part to top', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline defaultSelected={[0, 5]} onChange={noop} />
                </div>,
            );
            cy.get('.resize-bottom').trigger('mousedown');

            const timeslotDefaultHeight = 60;
            const endHour = 3;
            const interval = 2;

            cy.get('.day-timeline-period.new-period')
                .scrollIntoView()
                .trigger('mousemove', {
                    clientY: -timeslotDefaultHeight,
                });
            cy.get('.day-timeline-period.new-period')
                .scrollIntoView()
                .trigger('mousemove', {
                    clientY: -timeslotDefaultHeight,
                });
            cy.get('.day-timeline-period.new-period')
                .scrollIntoView()
                .trigger('mousemove', {
                    clientY: -timeslotDefaultHeight,
                });
            cy.get('.day-timeline-period.new-period')
                .scrollIntoView()
                .trigger('mousemove', {
                    clientY: -timeslotDefaultHeight,
                });

            cy.get('body').trigger('mouseup');
            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'bottom')
                .then((bottomValue) => {
                    expect(bottomValue).to.be.eq(
                        `${(24 - endHour) * interval * timeslotDefaultHeight}px`,
                    );
                });
        });
    });

    describe('selected period on user click', () => {
        it('should set selected period of 30 min after user click', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline onChange={noop} />
                </div>,
            );

            cy.get('.timeline-item').eq(2).trigger('click');

            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'top')
                .then((top) => expect(top).to.be.eq('120px'));
        });

        it('should move selected period to the place where click appeared', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline defaultSelected={[3, 4.5]} onChange={noop} />
                </div>,
            );

            cy.get('.timeline-item').eq(17).trigger('click');
            cy.wait(10);
            cy.get('.day-timeline-period.new-period')
                .should('have.css', 'top')
                .then((top) => expect(top).to.be.eq(`${8.5 * 2 * 60}px`));
            //
        });
    });

    describe('onChange event', () => {
        before(() => {
            const mockDate = new Date(2011, 10, 11, 11, 11, 0);

            cy.clock(mockDate.getTime());
        });
        it('should should trigger change event on top resize', () => {
            const onChangeSpy = cy.spy().as('onChangeSpy');

            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        defaultSelected={[1, 2]}
                        onChange={onChangeSpy}
                    />
                </div>,
            );
            cy.get('.resize-top').trigger('mousedown');
            cy.get('body').trigger('mousemove', {
                clientY: -timeslotDefaultHeight,
            });

            cy.get('body').trigger('mouseup');
            cy.get('@onChangeSpy').should('have.been.called');

            cy.get('.resize-top').then(() => {
                const callArg = onChangeSpy.getCall(0).args[0];
                expect(callArg.start.getHours()).to.be.eq(0);
                expect(callArg.end.getHours()).to.be.eq(2);
                expect(callArg.start.getMinutes()).to.be.eq(30);
                expect(callArg.end.getMinutes()).to.be.eq(0);
            });
        });

        it('should trigger change on event to bottom resize', () => {
            const onChangeSpy = cy.spy().as('onChangeSpy');

            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        defaultSelected={[18, 19.5]}
                        onChange={onChangeSpy}
                    />
                </div>,
            );
            cy.get('.resize-bottom').trigger('mousedown');
            const timeslotDefaultHeight = 60;
            cy.get('.day-timeline-period.new-period')
                .scrollIntoView()
                .then((el) => {
                    const rect = el[0].getBoundingClientRect();

                    return rect.top + rect.height;
                })
                .then((top) => {
                    cy.get('.day-timeline-period.new-period')
                        .scrollIntoView()
                        .trigger('mousemove', {
                            clientY: top + timeslotDefaultHeight + 1,
                        });
                });

            cy.get('body').trigger('mouseup');
            cy.get('@onChangeSpy').should('have.been.called');

            cy.get('.resize-bottom').then(() => {
                const callArg = onChangeSpy.getCall(0).args[0];
                expect(callArg.start.getHours()).to.be.eq(18);
                expect(callArg.end.getHours()).to.be.eq(20);
                expect(callArg.start.getMinutes()).to.be.eq(0);
                expect(callArg.end.getMinutes()).to.be.eq(0);
            });
        });
    });

    describe('current time', () => {
        beforeEach(() => {
            const mockDate = new Date(2011, 10, 11, 11, 11, 0);

            cy.clock(mockDate.getTime());
        });
        it('should current time should has correct position', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        currentTime={{ showTime: true, showLine: true }}
                        onChange={noop}
                    />
                </div>,
            );
            cy.get('.current-time')
                .should('have.css', 'top')
                .then((top) => {
                    const elevenHourPosition = 11 * 2 * timeslotDefaultHeight;
                    const eleventThirty = 11.5 * 2 * timeslotDefaultHeight;
                    const currentPosition = parseInt(top);
                    expect(currentPosition)
                        .is.greaterThan(elevenHourPosition)
                        .and.lessThan(eleventThirty);
                });
        });
        it('should show current time', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        currentTime={{ showTime: true, showLine: true }}
                        onChange={noop}
                    />
                </div>,
            );

            cy.get('.current-time').should('exist');
            cy.get('.current-time .current-time-label').should(
                'have.text',
                '11:11',
            );
        });

        it('should handle custom component for current time', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline
                        currentTime={{
                            showTime: true,
                            showLine: true,
                            component: (props) => (
                                <div id={'test'}>hello {props.timeLabel}</div>
                            ),
                        }}
                        onChange={noop}
                    />
                </div>,
            );

            cy.get('.current-time').should('exist');
            cy.get('#test').should('have.text', 'hello 11:11');
        });
    });

    describe('interval tests', () => {
        it('should correctly render for particular interval', () => {
            cy.mount(
                <div style={{ padding: '50px' }}>
                    <DayTimeline interval={60} onChange={noop} />
                </div>,
            );

            cy.get('.timeline-item').should('have.length', 24);
        });
    });
});
